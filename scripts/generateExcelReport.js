import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { renderPieChart } from "./pieChart.js";

// ---- Colours ----
const INK = "FF1F2937";
const MUTED = "FF6B7280";
const RULE = "FFD6DEEC";
const WHITE = "FFFFFFFF";
const BLUE_HEADER = "FF4472C4";
const BLUE_ZEBRA = "FFEDF2FA";
const GREEN_HEADER = "FF38761D";
const GREEN_TINT = "FFF0F6EC";

// Every status is shown with its label too, so colour is never the only cue
const STATUS = {
  passed: {
    label: "Passed",
    text: "FF0B7A0B",
    fill: "FFE7F6E7",
    hex: "#0CA30C",
  },
  failed: {
    label: "Failed",
    text: "FFA32020",
    fill: "FFFBE9E9",
    hex: "#D03B3B",
  },
  timedOut: {
    label: "Timed Out",
    text: "FF9A4520",
    fill: "FFFBEDE6",
    hex: "#EC835A",
  },
  flaky: { label: "Flaky", text: "FF7A5600", fill: "FFFEF5E0", hex: "#FAB219" },
  skipped: {
    label: "Skipped",
    text: "FF4B5563",
    fill: "FFF3F4F6",
    hex: "#9CA3AF",
  },
};
const STATUS_ORDER = ["passed", "failed", "timedOut", "flaky", "skipped"];

// Run Info / chart live in these two columns, to the right of the results table
const INFO_COL = 9; // I
const VALUE_COL = 10; // J

const fill = (argb) => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});
const thin = (argb = RULE) => ({ style: "thin", color: { argb } });

const formatDuration = (ms) => {
  if (!ms && ms !== 0) return "";
  const s = Math.round(ms / 100) / 10;
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s - m * 60)}s`;
};

/**
 * @implements {import('@playwright/test/reporter').Reporter}
 */
class ExcelReporter {
  constructor(options) {
    this.options = options || {};
    this.results = [];

    this.reportDir =
      process.env.PLAYWRIGHT_REPORT_DIR ||
      path.join(process.cwd(), "playwright-report");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.reportPath = path.join(
      this.reportDir,
      this.options.outputFile || `playwright-report-${timestamp}.xlsx`,
    );
  }

  onBegin(config, suite) {
    this.startTime = new Date();
    this.projectName = this.options.projectName || "Automation Exercise";
    this.testUrl = config.projects?.[0]?.use?.baseURL || "";
    this.workers = config.workers;
    console.log(`ExcelReporter started for project: ${this.projectName}`);
  }

  onTestEnd(test, result) {
    const absoluteFilePath = test.location?.file || "";
    const filePath = absoluteFilePath
      ? path.relative(process.cwd(), absoluteFilePath)
      : "";
    const line = test.location?.line || 0;

    // One row per test - a later retry replaces the earlier attempt
    const testId = `${absoluteFilePath}:${line}:${test.title}`;
    this.results = this.results.filter(
      (r) => `${r._file}:${r._line}:${r.title}` !== testId,
    );

    // outcome() folds retries into a final verdict, including "flaky"
    const outcome = test.outcome();
    const status =
      outcome === "flaky"
        ? "flaky"
        : outcome === "skipped"
          ? "skipped"
          : result.status;

    this.results.push({
      file: filePath,
      suite: test.parent?.title || "",
      title: test.title,
      status,
      duration: result.duration,
      retries: result.retry,
      error: (result.error?.message || "").replace(/\[\d+m/g, "").trim(),
      _file: absoluteFilePath,
      _line: line,
    });
  }

  async onEnd() {
    try {
      if (!fs.existsSync(this.reportDir)) {
        fs.mkdirSync(this.reportDir, { recursive: true });
      }

      const rows = [...this.results].sort((a, b) =>
        a._file === b._file ? a._line - b._line : a._file < b._file ? -1 : 1,
      );

      const workbook = new ExcelJS.Workbook();
      workbook.creator = this.projectName;
      workbook.created = this.startTime;

      const ws = workbook.addWorksheet("Test Results");
      this.buildResultsTable(ws, rows);
      const nextRow = this.buildRunInfo(ws, rows);
      this.buildChart(workbook, ws, rows, nextRow);

      ws.views = [{ state: "frozen", ySplit: 1, showGridLines: false }];

      await workbook.xlsx.writeFile(this.reportPath);
      console.log(`\nExcel report generated: ${this.reportPath}\n`);
    } catch (error) {
      console.error("Failed to generate Excel report:", error);
    }
  }

  // =========================================================================
  // RESULTS TABLE (columns A-G)
  // =========================================================================
  buildResultsTable(ws, rows) {
    const columns = [
      ["File", 38],
      ["Test Suite", 24],
      ["Test Case", 54],
      ["Status", 12],
      ["Duration", 11],
      ["Retries", 9],
      ["Error", 58],
      ["", 3], // spacer before the Run Info block
      ["", 18],
      ["", 30],
    ];
    columns.forEach(([, width], i) => (ws.getColumn(i + 1).width = width));

    const header = ws.getRow(1);
    header.height = 24;
    columns.slice(0, 7).forEach(([label], i) => {
      const cell = header.getCell(i + 1);
      cell.value = label;
      cell.font = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: WHITE },
      };
      cell.fill = fill(BLUE_HEADER);
      cell.alignment = {
        vertical: "middle",
        horizontal: i >= 3 && i <= 5 ? "center" : "left",
      };
    });

    // Alternate the tint per spec file so each file reads as one block
    let currentFile = null;
    let band = false;

    rows.forEach((r, index) => {
      if (r.file !== currentFile) {
        currentFile = r.file;
        band = !band;
      }

      const row = ws.getRow(index + 2);
      row.height = r.error ? 32 : 18;

      const values = [
        r.file,
        r.suite,
        r.title,
        STATUS[r.status]?.label || r.status,
        formatDuration(r.duration),
        r.retries,
        r.error,
      ];

      values.forEach((value, i) => {
        const cell = row.getCell(i + 1);
        cell.value = value;
        cell.font = { name: "Calibri", size: 10, color: { argb: INK } };
        cell.border = { bottom: thin() };
        cell.alignment = {
          vertical: "middle",
          horizontal: i === 4 || i === 5 ? "center" : "left",
          wrapText: i === 6,
        };
        if (band) cell.fill = fill(BLUE_ZEBRA);
      });

      this.statusCell(row.getCell(4), r.status);

      if (r.error) {
        row.getCell(7).font = {
          name: "Calibri",
          size: 9,
          color: { argb: STATUS.failed.text },
        };
      }
    });

    ws.autoFilter = { from: "A1", to: `G${rows.length + 1}` };
  }

  statusCell(cell, key) {
    const s = STATUS[key] || STATUS.skipped;
    cell.value = s.label;
    cell.font = {
      name: "Calibri",
      size: 10,
      bold: true,
      color: { argb: s.text },
    };
    cell.fill = fill(s.fill);
    cell.alignment = { horizontal: "center", vertical: "middle" };
  }

  // =========================================================================
  // RUN INFO + SUMMARY (columns I-J)  -> returns the next free row
  // =========================================================================
  buildRunInfo(ws, rows) {
    const total = rows.length;
    const count = (s) => rows.filter((r) => r.status === s).length;
    const end = new Date();

    let r = 1;

    r = this.blockHeader(ws, r, "Run Info");
    const info = [
      ["Project", this.projectName],
      ["Test URL", this.testUrl],
      ["Start Time", this.startTime.toLocaleString()],
      ["End Time", end.toLocaleString()],
      ["Duration", formatDuration(end - this.startTime)],
      ["Workers", String(this.workers ?? "")],
      ["Environment", process.env.CI ? "CI (GitHub Actions)" : "Local"],
    ];
    for (const [label, value] of info) r = this.infoRow(ws, r, label, value);

    r += 1;

    r = this.blockHeader(ws, r, "Results");
    r = this.infoRow(ws, r, "Total Tests", total, INK, true);

    STATUS_ORDER.forEach((key) => {
      const n = count(key);
      if (!n && key !== "passed" && key !== "failed") return;
      const pct = total ? (n / total) * 100 : 0;
      r = this.infoRow(
        ws,
        r,
        STATUS[key].label,
        `${n}  (${pct.toFixed(1)}%)`,
        STATUS[key].text,
        true,
      );
    });

    return r + 1;
  }

  // These blocks share rows with the results table, so they must never set a
  // row height - doing so squashes the taller rows that hold error text
  blockHeader(ws, rowIndex, title) {
    ws.mergeCells(rowIndex, INFO_COL, rowIndex, VALUE_COL);
    const cell = ws.getCell(rowIndex, INFO_COL);
    cell.value = title;
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: WHITE },
    };
    cell.fill = fill(GREEN_HEADER);
    cell.alignment = { horizontal: "left", vertical: "middle" };
    return rowIndex + 1;
  }

  infoRow(ws, rowIndex, label, value, valueColour = INK, bold = false) {
    const labelCell = ws.getCell(rowIndex, INFO_COL);
    labelCell.value = label;
    labelCell.font = { name: "Calibri", size: 10, color: { argb: MUTED } };
    labelCell.fill = fill(GREEN_TINT);
    labelCell.border = { bottom: thin(), left: thin() };
    labelCell.alignment = { vertical: "middle" };

    const valueCell = ws.getCell(rowIndex, VALUE_COL);
    valueCell.value = value;
    valueCell.font = {
      name: "Calibri",
      size: 10,
      bold,
      color: { argb: valueColour },
    };
    valueCell.border = { bottom: thin(), right: thin() };
    valueCell.alignment = { vertical: "middle" };

    return rowIndex + 1;
  }

  // =========================================================================
  // PIE CHART - sits below the Run Info block
  // =========================================================================
  buildChart(workbook, ws, rows, startRow) {
    const total = rows.length;
    if (!total) return;

    const count = (s) => rows.filter((r) => r.status === s).length;
    const present = STATUS_ORDER.map((key) => ({
      key,
      value: count(key),
    })).filter((s) => s.value > 0);

    const png = renderPieChart(
      present.map((s) => ({ value: s.value, color: STATUS[s.key].hex })),
    );
    if (!png) return;

    let r = this.blockHeader(ws, startRow, "Pass / Fail Breakdown");

    // Legend: a colour chip beside its label, so the pie is never read by
    // colour alone
    const legendStart = r;
    present.forEach((s) => {
      const chip = ws.getCell(r, INFO_COL);
      chip.value = STATUS[s.key].label;
      chip.font = {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: STATUS[s.key].text },
      };
      chip.fill = fill(STATUS[s.key].fill);
      chip.alignment = { vertical: "middle" };
      chip.border = { bottom: thin(), left: thin() };

      const value = ws.getCell(r, VALUE_COL);
      value.value = `${s.value}  (${((s.value / total) * 100).toFixed(1)}%)`;
      value.font = { name: "Calibri", size: 10, color: { argb: INK } };
      value.border = { bottom: thin(), right: thin() };
      value.alignment = { vertical: "middle" };

      r++;
    });

    // A oneCell anchor keeps its own size, so the image floats over whatever
    // rows the results table happens to have - never resize them here
    const imageRow = r + 1;

    const imageId = workbook.addImage({ buffer: png, extension: "png" });
    ws.addImage(imageId, {
      tl: { col: INFO_COL - 1, row: imageRow - 1 },
      ext: { width: 290, height: 290 },
      editAs: "oneCell",
    });

    return legendStart;
  }
}

export default ExcelReporter;
