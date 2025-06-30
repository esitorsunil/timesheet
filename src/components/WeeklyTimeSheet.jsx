import { format } from "date-fns";

function formatDuration(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h} h ${m.toString().padStart(2, "0")} m`;
}

export default function WeeklyTimesheetTable({
  members,
  dateRange,
  filteredHoursByMember,
  totalHoursByMember,
}) {
  const grandTotal = () => {
    const total = Object.values(totalHoursByMember).reduce((acc, val) => acc + val, 0);
    return formatDuration(total);
  };

  return (
    <div className="bg-white shadow-sm rounded p-3 mb-3">
      {/* Grid Header */}
      <div
        className="d-grid mb-4"
        style={{
          gridTemplateColumns:
            "minmax(120px, 6.5%) repeat(7, minmax(100px, 1fr)) minmax(100px, 1fr)",
          alignItems: "start",
        }}
      >
        <div className="text-center">
          <div className="text-muted fw-semibold">Members</div>
          <div className="fw-semibold pt-2">{members.length}</div>
        </div>

        {dateRange.map((date, i) => (
          <div
            key={i}
            className="text-center d-flex flex-column justify-content-end align-items-center"
          >
            <div className="fw-semibold text-uppercase text-secondary small">
              {format(date, "EEE")}
            </div>
            <div className="date-box">{format(date, "dd")}</div>
          </div>
        ))}

        <div className="text-center d-flex flex-column justify-content-end align-items-center">
          <div className="fw-semibold text-muted">Total Hours</div>
          <div className="badge bg-secondary-subtle text-dark mt-2 p-2">
            {grandTotal()}
          </div>
        </div>
      </div>

      {/* Member Rows */}
      {members.map((member, i) => (
        <div
          key={i}
          className="d-grid align-items-center"
          style={{
            gridTemplateColumns:
              "minmax(120px, 6.5%) repeat(7, minmax(100px, 1fr)) minmax(100px, 1fr)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <img
              src={member.avatar}
              alt={member.name}
              className="rounded-circle"
              width="30"
              height="30"
            />
            <span>{member.name}</span>
          </div>

          {dateRange.map((date, j) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const hours = filteredHoursByMember[member.name]?.[formattedDate];
            return (
              <div
                key={j}
                className="text-center d-flex align-items-center justify-content-center"
                style={{
                  border: "1px solid rgb(240, 243, 247)",
                  color: "rgb(61, 77, 105)",
                  height: "80px",
                }}
              >
                {hours ? formatDuration(hours) : "-"}
              </div>
            );
          })}

          <div
            className="text-center d-flex align-items-center justify-content-center"
            style={{
              border: "1px solid rgb(240, 243, 247)",
              color: "rgb(61, 77, 105)",
              height: "80px",
            }}
          >
            <span className="badge bg-secondary-subtle text-dark mt-2 p-2">
              {formatDuration(totalHoursByMember[member.name] || 0)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
