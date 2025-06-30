import TimesheetFilters from "../components/TimesheetFilter";
import WeeklyTimesheetTable from "../components/WeeklyTimeSheet";
import timesheetData from "../data/timeSheetData.json";
import { useMemo, useState } from "react";
import { eachDayOfInterval, parseISO, addDays } from "date-fns";
import DownloadPDFButton from "../utils/DownloadPDFButton";
import ExportExcelButton from "../utils/ExportExcelButton";

export default function Weekly() {
  const entries = timesheetData?.timesheet?.weekly?.entries || [];

  const [filters, setFilters] = useState({
    selectedStartDate: "2025-06-24",
    selectedProject: "",
    selectedTask: "",
    selectedMember: "", // ✅ Add member filter
  });

  const dateRange = useMemo(() => {
  const start = parseISO(filters.selectedStartDate);
  const end = addDays(start, 6); // ✅ Correct for weekly (7 days total)
  return eachDayOfInterval({ start, end });
}, [filters.selectedStartDate]);

  const members = useMemo(() => {
    return entries
      .filter((e) =>
        filters.selectedMember ? e.employeeName === filters.selectedMember : true
      )
      .map((e) => ({
        name: e.employeeName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          e.employeeName
        )}&background=random`,
        projects: e.projects || [],
      }));
  }, [entries, filters.selectedMember]);

  const filteredHoursByMember = useMemo(() => {
    const result = {};
    const start = parseISO(filters.selectedStartDate);
    const end = addDays(start, 6);

    members.forEach(({ name, projects }) => {
      result[name] = {};
      projects.forEach((project) => {
        if (filters.selectedProject && project.projectName !== filters.selectedProject) return;

        project.tasks.forEach((task) => {
          if (filters.selectedTask && task.taskName !== filters.selectedTask) return;

          task.daily.forEach(({ date, hours }) => {
            const entryDate = parseISO(date);
            if (entryDate >= start && entryDate <= end) {
              if (!result[name][date]) result[name][date] = 0;
              result[name][date] += hours;
            }
          });
        });
      });
    });

    return result;
  }, [members, filters]);

  const totalHoursByMember = useMemo(() => {
    const result = {};
    Object.keys(filteredHoursByMember).forEach((name) => {
      result[name] = Object.values(filteredHoursByMember[name]).reduce((a, b) => a + b, 0);
    });
    return result;
  }, [filteredHoursByMember]);

  const filteredWeeklyEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filters.selectedMember && entry.employeeName !== filters.selectedMember) return false;

      const matchesProject = (project) =>
        !filters.selectedProject || project.projectName === filters.selectedProject;

      const matchesTask = (task) =>
        !filters.selectedTask || task.taskName === filters.selectedTask;

      const filteredProjects = entry.projects
        .map((project) => {
          if (!matchesProject(project)) return null;

          const filteredTasks = project.tasks
            .map((task) => {
              if (!matchesTask(task)) return null;

              const filteredDaily = task.daily.filter(({ date }) => {
                const d = parseISO(date);
                const start = parseISO(filters.selectedStartDate);
                const end = addDays(start, 6);
                return d >= start && d <= end;
              });

              return filteredDaily.length > 0
                ? { ...task, daily: filteredDaily }
                : null;
            })
            .filter(Boolean);

          return filteredTasks.length > 0
            ? { ...project, tasks: filteredTasks }
            : null;
        })
        .filter(Boolean);

      return filteredProjects.length > 0
        ? { ...entry, projects: filteredProjects }
        : false;
    });
  }, [entries, filters]);

  return (
    <div className="container-fluid px-5 mt-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Weekly Timesheet</h3>
        <div className="d-flex gap-2">
          <DownloadPDFButton
            filteredEntries={filteredWeeklyEntries}
            filters={filters}
            viewType="weekly"
          />
          <ExportExcelButton
            filteredEntries={filteredWeeklyEntries}
            filters={filters}
            viewType="weekly"
          />
        </div>
      </div>

      <TimesheetFilters
  entries={entries}
  filters={filters}
  onFilterChange={setFilters}
  dateType="range"
  showMemberFilter={true}
  showTodayButton={false}
  rangeLength={7} // 🆕 Add this
/>

      <WeeklyTimesheetTable
        members={members}
        dateRange={dateRange}
        filteredHoursByMember={filteredHoursByMember}
        totalHoursByMember={totalHoursByMember}
      />
    </div>
  );
}
