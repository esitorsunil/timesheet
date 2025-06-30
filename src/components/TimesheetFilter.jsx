import { useMemo } from "react";
import { BiCalendar, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { format, parseISO, addDays } from "date-fns";
import Select from "react-select";

export default function TimesheetFilters({
  entries,
  filters = {},
  onFilterChange,
  showTodayButton = true,
  dateType = "single",
  showMemberFilter = false,
  rangeLength = 7, // 🆕 Default to 7 days
}) {
  const {
    selectedDate = "",
    selectedStartDate = "",
    selectedProject = "",
    selectedTask = "",
    selectedMember = "",
  } = filters;

  const allMembers = useMemo(() => {
    const set = new Set();
    entries?.forEach((entry) => set.add(entry.employeeName));
    return Array.from(set);
  }, [entries]);

  const allProjects = useMemo(() => {
    const projectSet = new Set();
    entries?.forEach((entry) =>
      entry.projects?.forEach((p) => projectSet.add(p.projectName))
    );
    return Array.from(projectSet);
  }, [entries]);

  const allTasks = useMemo(() => {
    if (!selectedProject) return [];
    const taskSet = new Set();
    entries?.forEach((entry) =>
      entry.projects
        ?.filter((p) => p.projectName === selectedProject)
        .forEach((p) => p.tasks?.forEach((t) => taskSet.add(t.taskName)))
    );
    return Array.from(taskSet);
  }, [entries, selectedProject]);

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    onFilterChange({
      ...filters,
      selectedDate: newDate.toISOString().split("T")[0],
    });
  };

  return (
    <div className="row align-items-center g-3 mb-4 mt-4">
      {/* Member Filter */}
      {showMemberFilter && (
  <div className="col-md-2">
    <label className="form-label fw-semibold text-secondary">Member</label>
   <Select
  classNamePrefix="react-select"
  options={allMembers.map((m) => ({ label: m, value: m }))}
  value={
    selectedMember
      ? { label: selectedMember, value: selectedMember }
      : { label: allMembers[0], value: allMembers[0] } // fallback to first member
  }
  onChange={(option) =>
    onFilterChange({
      ...filters,
      selectedMember: option?.value || "",
      selectedProject: "",
      selectedTask: "",
    })
  }
  isClearable={false}
  placeholder="Select member"
/>

  </div>
)}

      {/* Project Filter */}
      <div className="col-md-auto">
        <label className="form-label fw-semibold text-secondary">Projects</label>
        <select
          className="form-select"
          value={selectedProject}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              selectedProject: e.target.value,
              selectedTask: "",
            })
          }
        >
          <option value="">Select Project</option>
          {allProjects.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Task Filter */}
      {selectedProject && (
        <div className="col-md-auto">
          <label className="form-label fw-semibold text-secondary">Tasks</label>
          <select
            className="form-select"
            value={selectedTask}
            onChange={(e) =>
              onFilterChange({ ...filters, selectedTask: e.target.value })
            }
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

      {/* Weekly View */}
     {dateType === "range" && (
  <div className="col-md-auto">
    <label className="form-label fw-semibold text-secondary">Select Date</label>
    <div
      className="d-flex align-items-center border rounded px-2 py-1 bg-white"
      style={{ gap: "0.5rem", width: "fit-content" }}
    >
      <input
        type="text"
        className="form-control border-0 bg-white p-1 text-center"
        style={{ width: "120px" }}
        readOnly
        disabled
        value={format(parseISO(selectedStartDate), "dd/MM/yyyy")}
      />
      <span className="fw-semibold text-muted">to</span>
      <input
        type="text"
        className="form-control border-0 bg-white p-1 text-center"
        style={{ width: "120px" }}
        readOnly
        disabled
        // ✅ Change 6 to 13 for biweekly (14 days)
        value={format(addDays(parseISO(selectedStartDate), rangeLength - 1), "dd/MM/yyyy")}
        
      />
      <button
        className="btn btn-light border-0"
        type="button"
        onClick={() => document.getElementById("weekInput").showPicker?.()}
        aria-label="Pick start date"
      >
        <BiCalendar size={20} />
      </button>
      <input
        id="weekInput"
        type="date"
        style={{ position: "absolute", visibility: "hidden", width: 0, height: 0 }}
        value={selectedStartDate}
        onChange={(e) =>
          onFilterChange({ ...filters, selectedStartDate: e.target.value })
        }
      />
    </div>
  </div>
)}


      {/* Daily View */}
      {dateType === "single" && (
        <div className="col-md-auto">
          <label className="form-label fw-semibold text-secondary">Select Date</label>
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
              onChange={(e) =>
                onFilterChange({ ...filters, selectedDate: e.target.value })
              }
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleDateChange(1)}
            >
              <BiChevronRight size={20} />
            </button>
            {showTodayButton && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    selectedDate: new Date().toISOString().split("T")[0],
                  })
                }
              >
                Today
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
