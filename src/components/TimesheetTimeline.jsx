import { useState } from "react";

export default function TimesheetTimeline({
  timesheetRows,
  filteredEntries,
  parseTime,
  parseBreakTime,
}) {
  const [activeInfoIndex, setActiveInfoIndex] = useState(null);

  const hoursRange = Array.from({ length: 15 }, (_, i) => 9 + i); // 9 AM - 11 PM
  const hourHeight = 75;

  const handleInfoClick = (index) => {
    setActiveInfoIndex((prev) => (prev === index ? null : index));
  };

  if (timesheetRows.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
        <img
          src="https://demo.apploye.com/static/media/no_data_artwork.c43ca210523019ca28270a568239aae0.svg"
          alt="No Data"
          style={{ maxWidth: "600px", marginBottom: "16px", height: "260px" }}
        />
        <h6>No timesheet data for this date</h6>
      </div>
    );
  }

  return (
    <div className="timeline-container bg-white rounded p-3 mt-4 position-relative">
      <div
        className="d-grid fw-semibold text-secondary mb-2 position-relative"
        style={{
          width: "calc(50% - 60px)",
          left: "120px",
          gridTemplateColumns: "1fr auto auto auto",
          gap: "7em",
        }}
      >
        <div>Project & Task</div>
        <div className="pe-3">Start</div>
        <div>End</div>
        <div className="pe-3">Total</div>
      </div>

      <div
        className="position-relative"
        style={{ minHeight: `${hoursRange.length * hourHeight}px` }}
      >
        {hoursRange.map((h) => (
          <div
            key={h}
            style={{
              height: `${hourHeight}px`,
              borderTop: "1px solid rgb(240, 243, 247)",
            }}
          >
            <small className="position-absolute" style={{ left: 0 }}>
              {h % 12 || 12}:00 {h < 12 ? "AM" : "PM"}
            </small>
          </div>
        ))}

        {/* Break Time Blocks */}
        {filteredEntries.map((entry, idx) => {
          const breakTime = parseBreakTime(entry.breakTime);
          if (!breakTime) return null;

          const top = (breakTime.start - 9) * hourHeight;
          const height = (breakTime.end - breakTime.start) * hourHeight;

          return (
            <div
              key={`break-${idx}`}
              className="position-absolute text-white small d-flex align-items-center justify-content-center"
              style={{
                left: "120px",
                top: `${top}px`,
                height: `${height}px`,
                width: "calc(50% - 60px)",
                backgroundColor: "rgb(250, 234, 234)",
                borderLeft: "6px solid red",
                zIndex: 0,
              }}
            >
           
            </div>
          );
        })}

        {/* Task Blocks */}
        {timesheetRows.map((row, index) => {
          const top = (parseTime(row.startTime) - 9) * hourHeight;
          const height =
            (parseTime(row.endTime) - parseTime(row.startTime)) * hourHeight;

          const breakEntry = filteredEntries.find(
            (entry) => entry.employeeName === row.employeeName
          );
          const breakTime = breakEntry ? parseBreakTime(breakEntry.breakTime) : null;

          return (
            <div
              key={index}
              className="position-absolute shadow-sm group"
              style={{
                left: "120px",
                top: `${top}px`,
                height: `${height}px`,
                width: "calc(50% - 60px)",
                zIndex: 1,
              }}
            >
              {/* Info Box */}
              {activeInfoIndex === index && breakTime && (
<div
  className="position-absolute shadow rounded border"
  style={{
    top: "-200px",
    right: 0,
    width: "360px",
    zIndex: 10,
    backgroundColor: "#f5f9fd",
    fontSize: "14px",
  }}
>
  {/* Top: Total Idle Time Summary */}
  <div className="d-flex justify-content-center align-items-center px-3 pt-3 mb-2">
    <span className="fw-semibold text-muted me-2">Total Idle Time</span>
    <span
      className="badge"
      style={{
        backgroundColor: "#fde9e9",
        color: "#d9534f",
        fontWeight: 600,
        fontSize: "13px",

      }}
    >
      {row.duration}
    </span>
  </div>

  <hr className="my-2 mx-3" />

  {/* Project Name */}
  <div className="px-3 fw-semibold mb-1">{row.projectName}</div>

  {/* Task Name */}
  <div className="px-3 text-muted mb-3">{row.taskName}</div>

  {/* Time Row */}
  <div className="d-flex justify-content-between px-3 pb-3">
    <div className="text-center">
      <div className="fw-semibold text-dark">{row.startTime}</div>
      <div className="text-muted small">Start Time</div>
    </div>
    <div className="text-center">
      <div className="fw-semibold text-dark">{row.endTime}</div>
      <div className="text-muted small">End Time</div>
    </div>
    <div className="text-center">
      <div className="fw-semibold text-dark">{row.duration}</div>
      <div className="text-muted small">Total Idle Time</div>
    </div>
  </div>
</div>


)}


              <div
                className="rounded d-grid align-items-center pe-2 position-relative"
                style={{
                  height: "100%",
                  backgroundColor: index % 2 === 0 ? "#e6f7f5" : "#f3f4ff",
                  padding: "12px",
                  borderLeft: `6px solid ${
                    index % 2 === 0 ? "#80cbc4" : "#9fa8f7"
                  }`,
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: "7rem",
                }}
              >
                <div>
                  <div className="fw-semibold">{row.projectName}</div>
                  <div className="text-muted small">{row.taskName}</div>
                </div>
                <div className="fw-semibold small text-dark">{row.startTime}</div>
                <div className="fw-semibold small text-dark">{row.endTime}</div>
                <div className="fw-semibold small text-dark pe-3">
                  {row.duration}
                </div>

                {/* Hover Icons */}
                <div
                  className="position-absolute top-0 end-0 me-2 mt-2 d-none group-hover d-flex gap-2"
                >
                  <i
                    className="bi bi-info-circle text-primary"
                    title="Break Info"
                    style={{ fontSize: "16px", cursor: "pointer" }}
                    onClick={() => handleInfoClick(index)}
                  ></i>
                  <i
                    className="bi bi-trash text-danger"
                    title="Delete (disabled)"
                    style={{
                      fontSize: "16px",
                      cursor: "not-allowed",
                      opacity: 0.5,
                    }}
                  ></i>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
