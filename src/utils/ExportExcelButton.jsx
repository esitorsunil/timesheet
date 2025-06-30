import * as XLSX from "xlsx";

export default function ExportExcelButton({ filteredEntries, filters, viewType = "weekly" }) {
  const generateExcel = () => {
    if (!filteredEntries || filteredEntries.length === 0) return;

    const rows = [];

    filteredEntries.forEach((entry) => {
      entry.projects.forEach((project) => {
        project.tasks.forEach((task) => {
          task.daily.forEach((log) => {
            rows.push({
              Employee: entry.employeeName,
              Project: project.projectName,
              Task: task.taskName,
              Date: log.date,
              Hours: log.hours,
            });
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-fit columns based on max content length
    const columnWidths = Object.keys(rows[0]).map((key) => {
      const maxLength = Math.max(
        key.length,
        ...rows.map((row) => (row[key] ? row[key].toString().length : 0))
      );
      return { wch: maxLength + 5 }; // +5 padding
    });

    worksheet["!cols"] = columnWidths;

    // Apply text wrapping to all cells
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cell_address]) continue;
        if (!worksheet[cell_address].s) worksheet[cell_address].s = {};
        worksheet[cell_address].s.alignment = { wrapText: true, vertical: "top" };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Timesheet");

    const fileName =
      viewType === "weekly"
        ? `Weekly_Timesheet_${filters.selectedStartDate}.xlsx`
        : `Timesheet_${filters.selectedDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button className="btn btn-outline-success btn-sm me-2" onClick={generateExcel}>
      <i className="bi bi-file-earmark-excel me-2"></i> Excel
    </button>
  );
}
