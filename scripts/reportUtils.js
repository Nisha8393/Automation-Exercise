// Shared helpers for the generated HTML reports.
import fs from "fs";
import ExcelJS from "exceljs";
import { execSync } from "child_process";

// R-AUTH-01, S-HP-02, E2E-PO-03, A11Y-SCAN-01, API-PROD-01
export const CASE_ID = /^(?:R|S|E2E|API|A11Y)-[A-Z]+-\d+$/;

// The ID prefix carries the test type, so the sheet needs no Test Type column.
export const layerOf = (id) => (id.startsWith("API-") ? "API" : "UI");

// Automated column -> yes | no | na | "". Tolerant of Y/N shorthand.
function normalizeAutomated(value) {
  const s = String(value ?? "")
    .trim()
    .toUpperCase();
  if (s === "YES" || s === "Y") return "yes";
  if (s === "N/A" || s === "NA") return "na";
  if (s === "NO" || s === "N") return "no";
  return "";
}

// The manual case workbook - the source of truth for coverage.
// Columns are found by header name, so reordering them in Excel is safe.
export async function readTestCases(workbookPath) {
  if (!fs.existsSync(workbookPath)) return [];
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(workbookPath);
  const ws = wb.getWorksheet("Test Cases");
  if (!ws) return [];

  const header = ws.getRow(1).values.map((v) => String(v ?? "").trim());
  const col = (re) => header.findIndex((h) => re.test(h));
  const at = {
    id: col(/^test case id$/i),
    module: col(/^module$/i),
    summary: col(/^test case summary$/i),
    expected: col(/^expected result$/i),
    status: col(/^status/i),
    automated: col(/^automated$/i),
    spec: col(/^spec$/i),
  };

  const text = (row, i) => {
    if (i < 1) return "";
    const v = row.getCell(i).value;
    if (v && typeof v === "object" && v.richText)
      return v.richText
        .map((t) => t.text)
        .join("")
        .trim();
    return String(v ?? "").trim();
  };

  const cases = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const id = text(row, at.id);
    if (!CASE_ID.test(id)) return;
    cases.push({
      id,
      layer: layerOf(id),
      feature: text(row, at.module),
      scenario: text(row, at.summary),
      expected: text(row, at.expected),
      status: text(row, at.status).toUpperCase(),
      automated: normalizeAutomated(text(row, at.automated)),
      spec: text(row, at.spec),
    });
  });
  return cases;
}

// Flatten Playwright JSON (--list or a run report) into a flat spec list.
export function walkSpecs(suites) {
  const specs = [];
  (function walk(group) {
    for (const s of group || []) {
      for (const spec of s.specs || []) specs.push(spec);
      walk(s.suites);
    }
  })(suites);
  return specs;
}

// Distinct case ids across the specs, deduped over projects.
// A spec whose every entry is fixme/skip is scaffolding, not coverage.
export function automatedTags(specs) {
  const tags = new Set();
  for (const spec of specs) {
    const entries = spec.tests || [];
    const runs = entries.some(
      (t) =>
        !(t.annotations || []).some(
          (a) => a.type === "fixme" || a.type === "skip",
        ),
    );
    if (entries.length && !runs) continue;
    for (const tag of spec.tags || []) {
      const id = tag.replace(/^@/, "");
      if (CASE_ID.test(id)) tags.add(id);
    }
  }
  return tags;
}

export function gitInfo(cwd) {
  const run = (cmd) => {
    try {
      return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim();
    } catch {
      return "";
    }
  };
  return {
    branch: run("git rev-parse --abbrev-ref HEAD"),
    commit: run("git rev-parse --short HEAD"),
  };
}

function donutSvg(segments, centerText, centerSub) {
  const total = segments.reduce((n, [, v]) => n + v, 0) || 1;
  const r = 60;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  let circles = "";
  for (const [color, value] of segments) {
    const len = (value / total) * circumference;
    circles +=
      `<circle cx="80" cy="80" r="${r}" fill="none" stroke="${color}" stroke-width="22" ` +
      `stroke-dasharray="${len.toFixed(2)} ${(circumference - len).toFixed(2)}" ` +
      `stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 80 80)"/>`;
    offset += len;
  }
  return (
    `<svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="${centerText} ${centerSub}">${circles}` +
    `<text x="80" y="76" text-anchor="middle" font-size="30" font-weight="700" fill="var(--ink)">${centerText}</text>` +
    `<text x="80" y="98" text-anchor="middle" font-size="11" fill="var(--muted)">${centerSub}</text></svg>`
  );
}

export function coverageDonut(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return donutSvg(
    [
      ["var(--pass)", done],
      ["var(--skip)", Math.max(total - done, 0)],
    ],
    `${pct}%`,
    "automated",
  );
}

export function card(label, value, sub = "") {
  return (
    `<div class="card"><div class="value">${value}</div>` +
    `<div class="label">${label}</div>` +
    (sub ? `<div class="sub">${sub}</div>` : "") +
    `</div>`
  );
}

// Escapes text taken from the sheet before it goes into the page.
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

const STYLES = `
  :root{--ink:#111827;--muted:#6b7280;--line:#e5e7eb;--bg:#f9fafb;--pass:#16a34a;--fail:#dc2626;--skip:#9ca3af;--accent:#1e3a5f}
  *{box-sizing:border-box} body{margin:0;font:14px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:#fff}
  .wrap{max-width:920px;margin:0 auto;padding:32px}
  header{border-bottom:2px solid var(--accent);padding-bottom:16px;margin-bottom:24px}
  h1{margin:0 0 4px;font-size:22px} .meta{color:var(--muted);font-size:13px} .meta span{margin-right:16px}
  .top{display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-bottom:28px}
  .cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;flex:1;min-width:280px}
  .card{border:1.5px solid var(--accent);border-radius:10px;padding:14px 16px;background:var(--bg)}
  .card .value{font-size:26px;font-weight:700}
  .card .label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .card .sub{font-size:12px;color:var(--muted);margin-top:2px}
  .chart{text-align:center} .legend{font-size:12px;color:var(--muted);margin-top:6px}
  .legend b{font-weight:600}
  .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin:0 4px 0 10px;vertical-align:middle}
  table{width:100%;border-collapse:collapse;margin-top:8px;border:1.5px solid var(--accent)}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line)}
  thead th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);border-bottom:2px solid var(--accent)}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  .code{font-family:ui-monospace,Menlo,monospace;color:var(--muted);font-size:11px}
  .bar{display:inline-block;width:90px;height:8px;border-radius:4px;background:var(--line);vertical-align:middle;overflow:hidden}
  .bar>span{display:block;height:100%;background:var(--pass)}
  h2{font-size:14px;margin:28px 0 8px}
  .empty{color:var(--muted);font-style:italic;padding:12px 10px}
  .gap{background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 16px;margin-top:8px}
  .gap ul{margin:6px 0;padding-left:18px} .gap li{font-size:13px}
  .none{color:var(--pass);font-weight:600}
  footer{margin-top:28px;color:var(--muted);font-size:12px;border-top:1px solid var(--accent);padding-top:12px}
  @media print{.wrap{max-width:none;padding:0}}`;

export function page({ title, heading, meta, body }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${STYLES}</style></head>
<body><div class="wrap">
  <header><h1>${heading}</h1><div class="meta">${meta}</div></header>
${body}
</div></body></html>`;
}

// "date · env · branch · commit"
export function metaLine(repoRoot) {
  const g = gitInfo(repoRoot);
  const env = process.env.CI ? "CI" : "local";
  const today = new Date().toISOString().slice(0, 10);
  return (
    `<span>📅 ${today}</span><span>🌐 ${env}</span>` +
    (g.branch ? `<span>🌿 ${g.branch}</span>` : "") +
    (g.commit ? `<span>🔖 ${g.commit}</span>` : "")
  );
}
