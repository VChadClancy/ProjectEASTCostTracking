// Export logic extracted from App.tsx
import * as XLSX from "xlsx";

export function createFileSafeName(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "project-budget";
}

export function downloadFile(fileContent: string, fileName: string, mimeType: string) {
  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function exportCsv(projectName: string, annualRollupRows: any[], monthlyRollupRows: any[]) {
  const fileBaseName = createFileSafeName(projectName);
  const combinedRows = [
    ...annualRollupRows.map((row) => ({ Scope: "Annual", ...row })),
    ...monthlyRollupRows.map((row) => ({ Scope: "Monthly", ...row })),
  ];
  const worksheet = XLSX.utils.json_to_sheet(combinedRows, {
    header: ["Scope", "Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
  });
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  downloadFile(csvContent, `${fileBaseName}-rollups.csv`, "text/csv;charset=utf-8;");
}

export function exportExcel(projectName: string, annualRollupRows: any[], monthlyRollupRows: any[]) {
  const fileBaseName = createFileSafeName(projectName);
  const workbook = XLSX.utils.book_new();
  const annualWorksheet = XLSX.utils.json_to_sheet(annualRollupRows, {
    header: ["Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
  });
  const monthlyWorksheet = XLSX.utils.json_to_sheet(monthlyRollupRows, {
    header: ["Level", "Period", "Cost Type", "Category", "Allocation", "Forecast", "Actual", "Variance"],
  });
  XLSX.utils.book_append_sheet(workbook, annualWorksheet, "Annual Rollup");
  XLSX.utils.book_append_sheet(workbook, monthlyWorksheet, "Monthly Rollup");
  XLSX.writeFile(workbook, `${fileBaseName}-rollups.xlsx`);
}
