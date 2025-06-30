import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO, addDays } from "date-fns";

export default function DownloadPDFButton({ filteredEntries, filters, viewType = "daily" }) {
  const getTitle = () => {
    return viewType === "weekly" ? "Weekly Timesheet Report" : "Daily Timesheet Report";
  };

  const getDateLabel = () => {
    if (viewType === "weekly") {
      const start = parseISO(filters.selectedStartDate);
      const end = addDays(start, 6);
      return `Week: ${format(start, "dd/MM/yyyy")} to ${format(end, "dd/MM/yyyy")}`;
    } else {
      return `Date: ${format(parseISO(filters.selectedDate), "dd/MM/yyyy")}`;
    }
  };

  const getFileName = () => {
    if (viewType === "weekly") {
      return `Weekly_Timesheet_${filters.selectedStartDate}.pdf`;
    } else {
      return `Timesheet_${filters.selectedDate}.pdf`;
    }
  };

  const generatePDF = () => {
    if (!filteredEntries || filteredEntries.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(getTitle(), 14, 15);
    doc.setFontSize(10);
    doc.text(getDateLabel(), 14, 22);
    doc.text(`Employee: ${filters.selectedMember || "All"}`, 14, 27);

    filteredEntries.forEach((entry, i) => {
      const rows = [];

      entry.projects.forEach((project) => {
        project.tasks.forEach((task) => {
          if (viewType === "weekly") {
            // Weekly: Loop through daily logs
            task.daily.forEach(({ date, hours }) => {
              rows.push([
                entry.employeeName,
                project.projectName,
                task.taskName,
                format(parseISO(date), "dd/MM/yyyy"),
                `${hours}h`,
              ]);
            });
          } else {
            // Daily: Direct task details
            rows.push([
              entry.employeeName,
              project.projectName,
              task.taskName,
              task.startTime || "-",
              task.endTime || "-",
              task.duration || "-",
            ]);
          }
        });
      });

      autoTable(doc, {
        head:
          viewType === "weekly"
            ? [["Employee", "Project", "Task", "Date", "Hours"]]
            : [["Employee", "Project", "Task", "Start Time", "End Time", "Duration"]],
        body: rows,
        startY: i === 0 ? 32 : doc.lastAutoTable.finalY + 10,
        theme: "striped",
      });
    });

    doc.save(getFileName());
  };

  return (
    <button className="btn btn-outline-secondary btn-sm me-2" onClick={generatePDF}>
      <i className="bi bi-download me-2"></i> PDF
    </button>
  );
}
