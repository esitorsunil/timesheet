import { useEffect, useMemo, useState } from "react";
import { BiPlus } from "react-icons/bi";
import TimesheetFilters from "../components/TimesheetFilter";
import TimesheetUserCard from "../components/TimesheetUserCard";
import TimesheetTimeline from "../components/TimesheetTimeline";
import timesheetData from "../data/timeSheetData.json";
import {
  parseTime,
  parseBreakTime,
  getTotalHours,
} from "../utils/timeUtils";
import DownloadPDFButton from "../utils/DownloadPDFButton";

export default function Daily() {
  const entries = timesheetData.timesheet.daily.entries;

  const [filters, setFilters] = useState({
    selectedDate: "2025-06-25",
    selectedMember: "",
    selectedProject: "",
    selectedTask: "",
  });

  const allMembers = useMemo(
    () => [...new Set(entries.map((entry) => entry.employeeName))],
    [entries]
  );

  useEffect(() => {
    if (!filters.selectedMember && allMembers.length > 0) {
      setFilters((prev) => ({
        ...prev,
        selectedMember: allMembers[0],
      }));
    }
  }, [allMembers, filters.selectedMember]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const isSameDate = entry.date === filters.selectedDate;
      const isMatchingMember = filters.selectedMember
        ? entry.employeeName === filters.selectedMember
        : true;
      const isMatchingProject = filters.selectedProject
        ? entry.projects.some(
            (project) => project.projectName === filters.selectedProject
          )
        : true;
      const isMatchingTask = filters.selectedTask
        ? entry.projects.some((project) =>
            project.tasks.some((task) => task.taskName === filters.selectedTask)
          )
        : true;
      return (
        isSameDate && isMatchingMember && isMatchingProject && isMatchingTask
      );
    });
  }, [entries, filters]);

  const timesheetRows = useMemo(() => {
    return filteredEntries.flatMap((entry) =>
      entry.projects.flatMap((project) =>
        project.tasks
          .filter((task) => {
            if (
              filters.selectedProject &&
              project.projectName !== filters.selectedProject
            )
              return false;
            if (filters.selectedTask && task.taskName !== filters.selectedTask)
              return false;
            return true;
          })
          .map((task) => ({
            employeeName: entry.employeeName,
            projectName: project.projectName,
            taskName: task.taskName,
            duration: task.duration,
            startTime: task.startTime,
            endTime: task.endTime,
          }))
      )
    );
  }, [filteredEntries, filters]);

  return (
    <div className="container-fluid px-5 mt-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
  <h3 className="mb-0">Daily Timesheet</h3>

  <div className="d-flex gap-2 justify-content-end">
    <DownloadPDFButton
  filteredEntries={filteredEntries}
  filters={filters}
  viewType="daily"
/>

    <button
      className="btn btn-outline-success d-flex align-items-center gap-1"
      onClick={() => console.log("Add manual time")}
    >
      <BiPlus size={18} />
      Add Manual Time
    </button>
  </div>
</div>

      <TimesheetFilters entries={entries} onFilterChange={handleFilterChange} filters={filters} showMemberFilter={true} allMembers={true}  dateType="single"/>

      <div className="mt-3">
        {filteredEntries.map((entry, index) => (
          <TimesheetUserCard
            key={index}
            employeeName={entry.employeeName}
            dateStr={filters.selectedDate}
            totalHours={getTotalHours(entry.projects, filters)}
          />
        ))}
      </div>

      <TimesheetTimeline
        timesheetRows={timesheetRows}
        filteredEntries={filteredEntries}
        parseTime={parseTime}
        parseBreakTime={parseBreakTime}
      />
    </div>
  );
}
