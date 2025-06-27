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

  // Collect all tasks from filteredEntries
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

  return (
    <div className="container-fluid px-5 mt-4 bg-light">
      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Daily Timesheet</h2>
        <button
          className="btn btn-outline-success d-flex align-items-center gap-1"
          onClick={() => console.log("Add manual time")}
        >
          <BiPlus size={18} />
          Add Manual Time
        </button>
      </div>

      {/* Filters */}
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
            isClearable
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
          </div>
        </div>
      </div>

      {/* Employee Summary Cards */}
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
                    <h5 className="mb-0">{entry.employeeName}</h5>
                    <small>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <div>Total Time</div>
                  <strong>{entry.totalHours}</strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning">
            No entries match the selected filters.
          </div>
        )}
      </div>

      {/* Timesheet Table (Separate Box) */}
      {timesheetRows.length > 0 && (
        <div className="mt-4 border rounded bg-white p-4">
          <h5 className="mb-3 text-secondary">Timesheet Details</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Project</th>
                  <th>Task</th>
                  <th>Duration</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {timesheetRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.employeeName}</td>
                    <td>{row.projectName}</td>
                    <td>{row.taskName}</td>
                    <td>{row.duration}</td>
                    <td>{row.startTime}</td>
                    <td>{row.endTime}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
