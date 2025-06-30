
export const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours + minutes / 60;
};

export const parseBreakTime = (breakRange) => {
  if (!breakRange) return null;
  const [startStr, endStr] = breakRange.split(" to ");
  const start = parseTime(startStr);
  const end = parseTime(endStr);
  return {
    start,        
    end,          
    raw: breakRange,      
    startTime: startStr,  
    endTime: endStr,      
  };
};
export const getTotalHours = (projects, filters) => {
  return projects.reduce((sum, project) => {
    const taskDurations = project.tasks
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
      .reduce((taskSum, task) => {
        const start = parseTime(task.startTime);
        const end = parseTime(task.endTime);
        return taskSum + (end - start);
      }, 0);
    return sum + taskDurations;
  }, 0);
};
