
export default function TimesheetUserCard({ employeeName, dateStr, totalHours }) {
  const date = new Date(dateStr + "T00:00:00");

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div className="border rounded p-3 mb-4 bg-white">
      <div className="d-flex align-items-center gap-3">
        <img
          src="https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
          alt="avatar"
          className="rounded-circle"
          width="50"
        />
        <div>
          <h6 className="mb-0">{employeeName}</h6>
        </div>
        <div className="ps-5">
          <small className="d-block fw-semibold">{formattedDate}</small>
          <small className="d-block text-secondary">{weekday}</small>
        </div>
        <div className="ps-5">
          <small className="d-block fw-semibold">
            {totalHours.toFixed(2)} hrs
          </small>
          <small className="d-block text-secondary">Total Time</small>
        </div>
      </div>
    </div>
  );
}
