// Refreshes the workbook's Automated and Spec columns from the @case-ID tags.
// The specs are the authority on what is automated; this writes that back so the
// sheet cannot drift. Manual columns (Preconditions, Test Data, Notes) are never
// touched, and an existing Status is never overwritten.
//
// Usage: node scripts/syncSpecs.js [--dry]
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import ExcelJS from "exceljs";
import { CASE_ID } from "./reportUtils.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const workbookPath = path.join(
  repoRoot,
  "test-scenarios",
  "AutomationExercise_TestCases.xlsx",
);
const dryRun = process.argv.includes("--dry");

// --reporter=json overrides the config's reporters, which --list would otherwise fire.
const listJson = JSON.parse(
  execSync("npx playwright test --list --reporter=json", {
    cwd: repoRoot,
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  }).toString(),
);

const specOf = {};
(function walk(suites) {
  for (const s of suites || []) {
    for (const spec of s.specs || [])
      for (const tag of spec.tags || []) {
        const id = tag.replace(/^@/, "");
        if (CASE_ID.test(id)) specOf[id] = `tests/${spec.file}`;
      }
    walk(s.suites);
  }
})(listJson.suites);

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(workbookPath);
const ws = wb.getWorksheet("Test Cases");

const header = ws.getRow(1).values.map((v) => String(v ?? "").trim());
const col = (re) => header.findIndex((h) => re.test(h));
const at = {
  id: col(/^test case id$/i),
  status: col(/^status/i),
  automated: col(/^automated$/i),
  spec: col(/^spec$/i),
};

const changes = [];
const seen = new Set();

ws.eachRow((row, n) => {
  if (n === 1) return;
  const id = String(row.getCell(at.id).value ?? "").trim();
  if (!CASE_ID.test(id)) return;
  seen.add(id);

  const spec = specOf[id];
  const wasAutomated = String(row.getCell(at.automated).value ?? "").trim();
  const wasSpec = String(row.getCell(at.spec).value ?? "").trim();
  // N/A is a human judgement that a case is not worth automating, so an
  // untagged N/A row stays N/A. Tagging it later still promotes it to Yes.
  const isNa = /^n\/?a$/i.test(wasAutomated);
  const nowAutomated = spec ? "Yes" : isNa ? wasAutomated : "No";
  const nowSpec = spec || "-";

  if (wasAutomated !== nowAutomated || wasSpec !== nowSpec) {
    changes.push(`${id}: ${wasAutomated} -> ${nowAutomated}  ${nowSpec}`);
    row.getCell(at.automated).value = nowAutomated;
    row.getCell(at.spec).value = nowSpec;
  }

  // Only ever fills a blank - a recorded FAIL/BLOCKED/N/A is left alone.
  // An automated case passed manually before it was automated.
  const status = String(row.getCell(at.status).value ?? "").trim();
  if (spec && !status) row.getCell(at.status).value = "PASS";
});

const orphans = Object.keys(specOf).filter((id) => !seen.has(id));

for (const c of changes) console.log(`  ${c}`);
if (orphans.length)
  console.log(
    `WARNING - tagged in a spec with no row in the sheet: ${orphans.join(", ")}`,
  );

if (!changes.length) {
  console.log("Already in sync - nothing to write.");
} else if (dryRun) {
  console.log(
    `\n${changes.length} row(s) would change (dry run, nothing written).`,
  );
} else {
  await wb.xlsx.writeFile(workbookPath);
  console.log(
    `\n${changes.length} row(s) updated in ${path.basename(workbookPath)}`,
  );
}
