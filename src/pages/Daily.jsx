import { useEffect, useMemo, useState } from "react";
import { BiChevronLeft, BiChevronRight, BiPlus } from "react-icons/bi";
import Select from "react-select";
import timesheetData from "../data/timeSheetData.json";

export default function Daily() {
  const entries = timesheetData.timesheet.daily.entries;

  const [selectedDate, setSelectedDate] = useState("2025-06-25");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  const allMembers = useMemo(
    () => [...new Set(entries.map((entry) => entry.employeeName))],
    [entries]
  );

  useEffect(() => {
    if (!selectedMember && allMembers.length > 0) {
      setSelectedMember(allMembers[0]);
    }
  }, [allMembers, selectedMember]);

  const filteredProjects =
    entries.find((e) => e.employeeName === selectedMember)?.projects || [];

  const allProjects = [...new Set(filteredProjects.map((p) => p.projectName))];

  const allTasks =
    selectedProject &&
    filteredProjects
      .filter((p) => p.projectName === selectedProject)
      .flatMap((p) => p.tasks.map((t) => t.taskName));

  const filteredEntries = entries.filter((entry) => {
    const isSameDate = entry.date === selectedDate;
    const isMatchingMember = selectedMember
      ? entry.employeeName === selectedMember
      : true;
    const isMatchingProject = selectedProject
      ? entry.projects.some(
          (project) => project.projectName === selectedProject
        )
      : true;
    const isMatchingTask = selectedTask
      ? entry.projects.some((project) =>
          project.tasks.some((task) => task.taskName === selectedTask)
        )
      : true;

    return isSameDate && isMatchingMember && isMatchingProject && isMatchingTask;
  });

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  return hours + minutes / 60;
};

  const timesheetRows = filteredEntries.flatMap((entry) =>
    entry.projects.flatMap((project) =>
      project.tasks
        .filter((task) => {
          if (selectedProject && project.projectName !== selectedProject)
            return false;
          if (selectedTask && task.taskName !== selectedTask) return false;
          return true;
        })
        .map((task) => ({
          employeeName: entry.employeeName,
          projectName: project.projectName,
          taskName: task.taskName,
          duration: task.duration,
          startTime: task.startTime,
          endTime: task.endTime,
          description: task.description || "—",
        }))
    )
  );

  const hoursRange = Array.from({ length: 15 }, (_, i) => 9 + i); // 9am to 11pm
  const hourHeight = 75;

  const getLocalDate = (dateStr) => {
  return new Date(dateStr + "T00:00:00");
};

const getTotalHours = (projects) => {
  return projects.reduce((sum, project) => {
    const taskDurations = project.tasks
      .filter((task) => {
        if (selectedProject && project.projectName !== selectedProject)
          return false;
        if (selectedTask && task.taskName !== selectedTask) return false;
        return true;
      })
      .reduce((taskSum, task) => {
        const start = parseTime(task.startTime);
        const end = parseTime(task.endTime);
        return taskSum + (end - start);
      }, 0);
    return sum + taskDurations;
  }, 0);
};


  return (
    <div className="container-fluid px-5 mt-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Daily Timesheet</h3>
        <button
          className="btn btn-outline-success d-flex align-items-center gap-1"
          onClick={() => console.log("Add manual time")}
        >
          <BiPlus size={18} />
          Add Manual Time
        </button>
      </div>

      <div className="row align-items-center g-3 mb-4 mt-4">
        {selectedMember && (
          <div className="col-md-auto">
            <label className="form-label fw-semibold text-secondary">
              Projects
            </label>
            <select
              className="form-select"
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedTask("");
              }}
            >
              <option value="">Select Project</option>
              {allProjects.map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedProject && (
          <div className="col-md-auto">
            <label className="form-label fw-semibold text-secondary">Tasks</label>
            <select
              className="form-select"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">Select Task</option>
              {allTasks.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-md-2">
          <label className="form-label fw-semibold text-secondary">Member</label>
          <Select
            classNamePrefix="react-select"
            options={allMembers.map((m) => ({ label: m, value: m }))}
            value={
              selectedMember
                ? { label: selectedMember, value: selectedMember }
                : null
            }
            onChange={(option) => {
              setSelectedMember(option?.value || "");
              setSelectedProject("");
              setSelectedTask("");
            }}
            isClearable={false}
            placeholder="Select member"
          />
        </div>

        <div className="col-md-auto">
          <label className="form-label fw-semibold text-secondary">
            Select Date
          </label>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleDateChange(-1)}
            >
              <BiChevronLeft size={20} />
            </button>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleDateChange(1)}
            >
              <BiChevronRight size={20} />
            </button>

            <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() =>
      setSelectedDate(new Date().toISOString().split("T")[0])
    }
  >
    Today
  </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <div key={index} className="border rounded p-3 mb-4 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png"
                    alt="avatar"
                    className="rounded-circle"
                    width="50"
                  />
                  <div>
                    <h6 className="mb-0">{entry.employeeName}</h6>
                    </div>

                  <div className="ps-5">
    <small className="d-block fw-semibold">
      {getLocalDate(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </small>
    <small className="d-block text-secondary">
      {getLocalDate(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
      })}
    </small>
  </div>

  <div className="ps-5">
    <small className="d-block fw-semibold">
      {getTotalHours(entry.projects).toFixed(2)} hrs
    </small>
    <small className="d-block text-secondary">Total Time</small>
  </div>
              </div>
              </div>
            </div>
          ))
        ) : null}
      </div>
{timesheetRows.length === 0 ? (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
    <img
      src="https://demo.apploye.com/static/media/no_data_artwork.c43ca210523019ca28270a568239aae0.svg"
      alt="No Data"
      style={{ maxWidth: "600px", marginBottom: "16px",  height: "260px"}}
    />
    <h6>No timesheet entries for this date</h6>
  </div>
) : (
  <div className="timeline-container bg-white rounded p-3 mt-4 position-relative">
 <div
  className="d-grid fw-semibold text-secondary mb-2 position-relative"
  style={{
    width: "calc(50% - 60px)",
    left: "120px",
    gridTemplateColumns: "1fr auto auto auto",
    gap: "7em",
    padding: "px",
  }}
>
  <div >Project & Task</div>
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

      {timesheetRows.map((row, index) => {
        const top = (parseTime(row.startTime) - 9) * hourHeight;
        const height =
          (parseTime(row.endTime) - parseTime(row.startTime)) * hourHeight;

        return (
    <div
  key={index}
  className="position-absolute rounded shadow-sm d-grid align-items-center pe-2"
  style={{
    left: "120px",
    top: `${top}px`,
    height: `${height}px`,
    width: "calc(50% - 60px)",
    backgroundColor: index % 2 === 0 ? "#e6f7f5" : "#f3f4ff",
    padding: "12px",
    borderLeft: `6px solid ${index % 2 === 0 ? "#80cbc4" : "#9fa8f7"}`,
    gridTemplateColumns: "1fr auto auto auto",
    gap: "7rem",
  }}
>
  {/* Grid Column 1: Project & Task */}
  <div>
    <div className="fw-semibold">{row.projectName}</div>
    <div className="text-muted small">{row.taskName}</div>
  </div>

  {/* Grid Column 2–4: Start | End | Total */}
  <div className="fw-semibold small text-dark">{row.startTime}</div>
  <div className="fw-semibold small text-dark">{row.endTime}</div>
  <div className="fw-semibold small text-dark pe-3">{row.duration}</div>
</div>
        );
      })}
    </div>
  </div>
)}
    </div>
  );
}
