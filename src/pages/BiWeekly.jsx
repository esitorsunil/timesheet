import { useState, useMemo, useEffect } from "react";
import timesheetData from "../data/timeSheetData.json";
import TimesheetFilters from "../components/TimesheetFilter";
import { eachDayOfInterval, parseISO, addDays, format } from "date-fns";

export default function BiWeekly() {
  const entries = timesheetData?.timesheet?.biweekly?.entries || [];

  const [filters, setFilters] = useState({
    selectedStartDate: "2025-06-23",
    selectedProject: "",
    selectedTask: "",
    selectedMember: "",
  });

useEffect(() => {
  if (entries.length && !filters.selectedMember) {
    setFilters((prev) => ({
      ...prev,
      selectedMember: entries[0].employeeName || "",
    }));
  }
}, [entries, filters.selectedMember]);

  const dateRange = useMemo(() => {
    const start = parseISO(filters.selectedStartDate);
    const end = addDays(start, 13); 
    return eachDayOfInterval({ start, end });
  }, [filters.selectedStartDate]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((e) =>
      filters.selectedMember ? e.employeeName === filters.selectedMember : true
    );
  }, [entries, filters.selectedMember]);

  const totalHoursSummary = useMemo(() => {
    const total = filteredEntries.reduce((sum, emp) => sum + emp.totalHours, 0);
    const hours = Math.floor(total);
    const minutes = Math.round((total - hours) * 60);
    return `${hours} h ${minutes} m`;
  }, [filteredEntries]);

  const getStyledBox = (hourValue, idx) => {
    const bgColors = ["#e6f7f9", "#fff6dc", "#edf6fd", "#fff6dc", "#edf6fd", "#fff6dc", "#e6f7f9"];
    const style = {
      backgroundColor: bgColors[idx % 7],
      borderRadius: "6px",
      padding: "6px 10px",
      display: "inline-block",
      minWidth: "90px",
    };

    return hourValue !== undefined ? (
      <span style={style} className="fw-semibold text-dark">
        {`${Math.floor(hourValue)} h ${Math.round((hourValue % 1) * 60)} m`}
      </span>
    ) : (
      <span style={style} className="text-muted">-</span>
    );
  };

  return (
    <div className="container-fluid px-5 mt-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Bi-Weekly Timesheet</h3>
      </div>

      <TimesheetFilters
        entries={entries}
        filters={filters}
        onFilterChange={handleFilterChange}
        dateType="range"
        showMemberFilter={true}
        showTodayButton={false}
        rangeLength={14}
      />

      <div className="rounded bg-white p-3 mt-4 shadow-sm">
        <div className="d-flex justify-content-start align-items-center mb-3 px-2 ">
          <p className="mb-0 fw-semibold text-secondary me-5">
            {format(dateRange[0], "MMMM dd")} - {format(dateRange[dateRange.length - 1], "MMMM dd")}
          </p>
          <div className="d-inline-flex align-items-center justify-content-center px-3 py-2 rounded" style={{ backgroundColor: "#ecf0fc", height: "40px" }}>
            <span className="text-muted me-2">Total Hour</span>
            <span className="fw-semibold text-secondary">{totalHoursSummary}</span>
          </div>
        </div>

        <div className="row text-center mb-4" style={{ height: "45px" , backgroundColor:"rgb(246, 248, 249)" }}>
          <div className=" fw-semibold text-secondary text-start"></div>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="col fw-semibold text-secondary">
              {format(dateRange[i], "EEE").toUpperCase()}
            </div>
          ))}
          <div className="col fw-semibold text-secondary">
            Total
          </div>
        </div>

        {filteredEntries.map((emp) => {
          const hourMap = {};
          emp.summary.forEach((s) => {
            hourMap[s.date] = s.hours;
          });

          const total = emp.totalHours;
          const totalH = Math.floor(total);
          const totalM = Math.round((total - totalH) * 60);
          const totalFormatted = `${totalH} h ${totalM} m`;

          return (
            <div key={emp.employeeId}>
              <div className="row text-center mb-2">
                
                {dateRange.slice(0, 7).map((d, idx) => {
                  const key = format(d, "yyyy-MM-dd");
                  return (
                    <div className="col" key={key} >
                      {getStyledBox(hourMap[key], idx)}
                      <div className="text-muted small mt-1">{format(d, "MMM dd")}</div>
                    </div>
                  );
                })}
                <div className="col" ></div>
              </div>

              <div className="row text-center mb-3 mt-5">
                {dateRange.slice(7).map((d, idx) => {
                  const key = format(d, "yyyy-MM-dd");
                  return (
                    <div className="col" key={key} >
                      {getStyledBox(hourMap[key], idx + 7)}
                      <div className="text-muted small mt-1">{format(d, "MMM dd")}</div>
                    </div>
                  );
                })}
                <div className="col d-flex align-items-center justify-content-center">
                  <span className="fw-semibold text-white" style={{ backgroundColor: "#00bfa5", borderRadius: "6px", padding: "6px 10px", minWidth: "90px" }}>
                    {totalFormatted}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
