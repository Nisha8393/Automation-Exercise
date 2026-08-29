// Automation coverage - how many manual cases are automated, per feature.
// A property of the SUITE, not of a run: it lists tests without executing them,
// so it needs no test run and can be run any time.
//
// Usage: node scripts/coverage.js [out.html]
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  readTestCases,
  walkSpecs,
  automatedTags,
  coverageDonut,
  card,
  page,
  metaLine,
  esc,
} from "./reportUtils.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const workbookPath = path.join(
  repoRoot,
  "test-scenarios",
  "AutomationExercise_TestCases.xlsx",
);
const today = new Date().toISOString().slice(0, 10);
const outPath =
  process.argv[2] ||
  path.join(repoRoot, "reports", "coverage", `coverage-${today}.html`);

// --reporter=json is not optional: --list attaches the config's reporters, so
// without it the Excel reporter fires and the HTML one opens a browser.
const listJson = JSON.parse(
  execSync("npx playwright test --list --reporter=json", {
    cwd: repoRoot,
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  }).toString(),
);
const tagged = automatedTags(walkSpecs(listJson.suites));
const cases = await readTestCases(workbookPath);

// One row per feature. Coverage is over automatable cases only - N/A excluded,
// because a case that cannot be automated should not drag the number down.
function featureRows(subset) {
  const byFeature = new Map();
  for (const c of subset) {
    const row = byFeature.get(c.feature) ?? {
      name: c.feature,
      total: 0,
      na: 0,
      automated: 0,
      pending: [],
    };
    row.total++;
    if (c.automated === "na") row.na++;
    else if (c.automated === "yes") row.automated++;
    else row.pending.push(c);
    byFeature.set(c.feature, row);
  }
  return [...byFeature.values()]
    .map((r) => {
      const automatable = r.total - r.na;
      return {
        ...r,
        automatable,
        coverage: automatable
          ? Math.round((r.automated / automatable) * 100)
          : null,
      };
    })
    .sort(
      (a, b) => (b.coverage ?? -1) - (a.coverage ?? -1) || b.total - a.total,
    );
}

const totals = (rows) => {
  const total = rows.reduce((n, r) => n + r.total, 0);
  const na = rows.reduce((n, r) => n + r.na, 0);
  const automated = rows.reduce((n, r) => n + r.automated, 0);
  const automatable = total - na;
  return {
    total,
    na,
    automated,
    automatable,
    pct: automatable ? Math.round((automated / automatable) * 100) : 0,
  };
};

const uiRows = featureRows(cases.filter((c) => c.layer === "UI"));
const apiRows = featureRows(cases.filter((c) => c.layer === "API"));
const all = totals([...uiRows, ...apiRows]);

// The sheet and the specs are two sources for the same fact - reconcile them so
// they cannot drift apart silently.
const sheetIds = new Set(cases.map((c) => c.id));
const yesIds = new Set(
  cases.filter((c) => c.automated === "yes").map((c) => c.id),
);
const taggedNotYes = [...tagged].filter((id) => !yesIds.has(id)).sort();
const yesNotTagged = [...yesIds].filter((id) => !tagged.has(id)).sort();
const orphanTags = [...tagged].filter((id) => !sheetIds.has(id)).sort();

for (const [label, ids] of [
  ['tagged in a spec but not marked "Yes"', taggedNotYes],
  ['marked "Yes" but no spec carries the tag', yesNotTagged],
  ["tagged in a spec with no row in the sheet", orphanTags],
]) {
  if (ids.length) console.log(`WARNING - ${label}: ${ids.join(", ")}`);
}

const table = (rows, emptyText) => {
  if (!rows.length)
    return `<table><tbody><tr><td class="empty">${emptyText}</td></tr></tbody></table>`;
  const body = rows
    .map(
      (r) => `<tr>
      <td>${esc(r.name)}</td>
      <td class="num">${r.total}</td>
      <td class="num">${r.na || ""}</td>
      <td class="num">${r.automated}</td>
      <td class="num">${
        r.coverage == null
          ? "—"
          : `<span class="bar"><span style="width:${r.coverage}%"></span></span> ${r.coverage}%`
      }</td>
    </tr>`,
    )
    .join("\n");
  return `<table>
    <thead><tr><th>Feature</th><th class="num">Cases</th><th class="num">N/A</th><th class="num">Automated</th><th class="num">Coverage</th></tr></thead>
    <tbody>${body}</tbody>
  </table>`;
};

// The backlog: every automatable case no spec covers yet.
const pending = [...uiRows, ...apiRows].flatMap((r) => r.pending);
const pendingHtml = pending.length
  ? `<div class="gap"><ul>${pending
      .map(
        (c) =>
          `<li><span class="code">${esc(c.id)}</span> ${esc(c.scenario)} <span class="code">${esc(c.feature)}</span></li>`,
      )
      .join("")}</ul></div>`
  : `<p class="none">None — every automatable case is covered.</p>`;

const drift = [
  ["Tagged but not marked Yes", taggedNotYes],
  ["Marked Yes but not tagged", yesNotTagged],
  ["Tagged with no row in the sheet", orphanTags],
].filter(([, ids]) => ids.length);

const driftHtml = drift.length
  ? `<div class="gap"><ul>${drift
      .map(
        ([label, ids]) =>
          `<li>${label}: <span class="code">${ids.map(esc).join(", ")}</span></li>`,
      )
      .join("")}</ul></div>`
  : `<p class="none">In sync — the sheet and the specs agree on all ${all.automated} automated cases.</p>`;

const body = `
  <div class="top">
    <div class="chart">${coverageDonut(all.automated, all.automatable)}
      <div class="legend">
        <span class="dot" style="background:var(--pass)"></span><b>${all.automated}</b> automated
        <span class="dot" style="background:var(--skip)"></span><b>${all.automatable - all.automated}</b> to automate
      </div>
    </div>
    <div class="cards">
      ${card("Automated", all.automated, `${all.pct}% of automatable`)}
      ${card("To automate", all.automatable - all.automated, "automatable, not yet")}
      ${card("N/A", all.na, "not automatable")}
      ${card("Total cases", all.total)}
    </div>
  </div>

  <h2>UI coverage by feature</h2>
  ${table(uiRows, "No UI cases in the sheet.")}

  <h2>API coverage by feature</h2>
  ${table(apiRows, "No API cases yet — add rows with an API- prefixed ID.")}

  <h2>Not automated (${pending.length})</h2>
  ${pendingHtml}

  <h2>Sheet vs specs</h2>
  ${driftHtml}

  <footer>Coverage = automated ÷ automatable (Yes ÷ Yes + No); N/A cases are excluded from both.
  Automated counts come from the <span class="code">Automated</span> column, cross-checked against the
  <span class="code">@CASE-ID</span> tags that <span class="code">playwright test --list</span> reports.
  This is a property of the suite, not of a run — for pass/fail see the Excel report.</footer>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  page({
    title: `Automation Coverage — ${today}`,
    heading: "Automation Exercise — Coverage",
    meta: metaLine(repoRoot),
    body,
  }),
);

console.log(`Coverage report written: ${path.relative(repoRoot, outPath)}`);
console.log(
  `  ${all.automated}/${all.automatable} automatable cases automated (${all.pct}%) across ${uiRows.length + apiRows.length} features, ${all.na} N/A`,
);
