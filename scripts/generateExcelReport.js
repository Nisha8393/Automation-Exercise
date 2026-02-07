import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

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
      this.options.outputFile || `playwright-report-${timestamp}.xlsx`
    );
  }

  onBegin(config, suite) {
    this.startTime = new Date();
    this.projectName = "Automation Exercise";
    this.testUrl = process.env.DASHBOARD_URL || "http://localhost:3000";
    console.log(`📊 ExcelReporter started for project: ${this.projectName}`);
  }

  onTestEnd(test, result) {
    const absoluteFilePath = test.location?.file || "";
    const filePath = absoluteFilePath
      ? "/" + path.relative(process.cwd(), absoluteFilePath)
      : "";
    const folderName = filePath ? path.basename(path.dirname(filePath)) : "";
    const fileName = filePath ? path.basename(filePath) : "";
    const line = test.location?.line || 0;

    // const steps = (result.steps || [])
    //   .filter((s) => s.category === "test.step") // only keep your test.step()
    //   .map((s, index) => `${index + 1}. ${s.title}`)
    //   .join("\n");

    // Create a unique test identifier
    const testId = `${absoluteFilePath}:${line}:${test.title}`;

    // Remove any existing entry for this test (to handle retries)
    this.results = this.results.filter((r) => {
      const existingId = `${r._file}:${r._line}:${r.title}`;
      return existingId !== testId;
    });

    // Add the latest result
    this.results.push({
      folder: folderName,
      file: filePath,
      fileName: fileName,
      suite: test.parent?.title || "",
      title: test.title,
      status: result.status,
      duration: result.duration,
      retries: result.retry,
      error: result.error?.message || "",
      //steps,
      _file: absoluteFilePath,
      _line: line,
    });
  }

  async onEnd(result) {
    try {
      if (!fs.existsSync(this.reportDir)) {
        fs.mkdirSync(this.reportDir, { recursive: true });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Test Results");

      // ---- Table headers (Steps column commented out) ----
      const headers = [
        { header: "File", key: "file", width: 50 },
        { header: "Test Suite", key: "suite", width: 30 },
        { header: "Test Case", key: "title", width: 50 },
        { header: "Status", key: "status", width: 12 },
        { header: "Duration (ms)", key: "duration", width: 15 },
        { header: "Retries", key: "retries", width: 10 },
        { header: "Error", key: "error", width: 80 },
        //{ header: "Steps", key: "steps", width: 100 },
      ];
      worksheet.columns = headers;

      // worksheet.getColumn("steps").alignment = {
      //   wrapText: true,
      //   vertical: "top",
      // };

      // Sort results by file and line number
      const sortedResults = this.results.sort((a, b) => {
        if (a._file < b._file) return -1;
        if (a._file > b._file) return 1;
        return a._line - b._line;
      });

      // Group sorted results by file path (not just folder)
      const grouped = sortedResults.reduce((acc, row) => {
        const key = row.file || "Unknown";
        acc[key] = acc[key] || [];
        acc[key].push(row);
        return acc;
      }, {});

      // Add rows organized by file
      for (const filePath of Object.keys(grouped).sort()) {
        const fileTests = grouped[filePath];
        const folderName = fileTests[0].folder;
        const fileName = fileTests[0].fileName;

        // Add file header row
        const fileRow = worksheet.addRow([`${folderName}/${fileName}`]);
        fileRow.font = { bold: true, color: { argb: "FF0066CC" } };
        fileRow.alignment = { horizontal: "left" };
        worksheet.mergeCells(fileRow.number, 1, fileRow.number, headers.length);

        // Remove internal fields before adding to worksheet
        const cleanRows = fileTests.map(
          ({ _file, _line, folder, fileName, ...rest }) => rest
        );
        const addedRows = worksheet.addRows(cleanRows);

        // Make test case titles bold
        addedRows.forEach((row) => {
          row.getCell("title").font = { bold: true };
        });
      }

      // ---- Run Info on RHS ----
      const runInfoStartCol = headers.length + 2;
      const startRow = 2;

      worksheet.getCell(startRow, runInfoStartCol).value = "📊 Run Info";
      worksheet.getCell(startRow, runInfoStartCol).font = { bold: true };

      worksheet.getCell(startRow + 1, runInfoStartCol).value = "Project";
      worksheet.getCell(startRow + 1, runInfoStartCol + 1).value =
        this.projectName;

      worksheet.getCell(startRow + 2, runInfoStartCol).value = "Start Time";
      worksheet.getCell(startRow + 2, runInfoStartCol + 1).value =
        this.startTime.toISOString();

      worksheet.getCell(startRow + 3, runInfoStartCol).value = "End Time";
      worksheet.getCell(startRow + 3, runInfoStartCol + 1).value =
        new Date().toISOString();

      worksheet.getCell(startRow + 4, runInfoStartCol).value = "Total Tests";
      worksheet.getCell(startRow + 4, runInfoStartCol + 1).value =
        sortedResults.length;

      worksheet.getCell(startRow + 5, runInfoStartCol).value = "Passed";
      worksheet.getCell(startRow + 5, runInfoStartCol + 1).value =
        sortedResults.filter((r) => r.status === "passed").length;

      worksheet.getCell(startRow + 6, runInfoStartCol).value = "Failed";
      worksheet.getCell(startRow + 6, runInfoStartCol + 1).value =
        sortedResults.filter((r) => r.status === "failed").length;

      worksheet.getCell(startRow + 7, runInfoStartCol).value = "Skipped";
      worksheet.getCell(startRow + 7, runInfoStartCol + 1).value =
        sortedResults.filter((r) => r.status === "skipped").length;

      worksheet.getCell(startRow + 8, runInfoStartCol).value = "Time Out";
      worksheet.getCell(startRow + 8, runInfoStartCol + 1).value =
        sortedResults.filter((r) => r.status === "timedOut").length;

      worksheet.getCell(startRow + 9, runInfoStartCol).value = "Test URL";
      worksheet.getCell(startRow + 9, runInfoStartCol + 1).value = this.testUrl;

      await workbook.xlsx.writeFile(this.reportPath);
      console.log(`\n✅ Excel report generated: ${this.reportPath}\n`);
    } catch (error) {
      console.error("❌ Failed to generate Excel report:", error);
    }
  }
}

export default ExcelReporter;
