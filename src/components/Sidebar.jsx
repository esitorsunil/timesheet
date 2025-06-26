import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function TimesheetSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const timesheetItems = [
    { path: "/daily", label: "Daily", icon: "bi-calendar-day" },
    { path: "/weekly", label: "Weekly", icon: "bi-calendar-week" },
    { path: "/bi-weekly", label: "Bi-Weekly", icon: "bi-calendar2-week" },
    { path: "/monthly", label: "Monthly", icon: "bi-calendar-month" },
  ];

  return (
    <div
      className={`sidenav bg-white text-dark ${expanded ? 'expanded' : 'collapsed'}`}
      style={{
        width: expanded ? '240px' : '72px',
        transition: 'width 0.3s ease',
        height: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        overflowX: 'hidden'
      }}
    >
      {/* Logo + Toggle */}
      <div className="toggle-btn d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src={
              expanded
                ? "https://www.pranathiss.com/static/assets/images/pranathiss-logo.webp"
                : "https://www.pranathiss.com/static/assets/images/favicon.webp"
            }
            alt="logo"
            style={{
              height: expanded ? '60px' : '25px',
              width: expanded ? '150px' : '25px',
              objectFit: 'contain',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
        <button
          className="btn btn-sm btn-outline-primary rounded-circle ms-auto"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        >
          <i className={`bi bi-chevron-${expanded ? 'left' : 'right'}`}></i>
        </button>
      </div>

      {/* Timesheet Section with Always-Visible Arrow */}
      <div
        className="logo-area px-3 mb-3 d-flex align-items-center justify-content-between"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="d-flex align-items-center">
          <i className="bi bi-clock fs-4 me-2"></i>
          {expanded && <span className="fw-bold">Timesheet</span>}
        </div>
        <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'}`}></i>
      </div>

      {/* Dropdown Navigation Items */}
      {showDropdown && (
        <nav className="nav flex-column px-2 text-dark">
          {timesheetItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-2 rounded mb-1 text-dark ${isActive ? 'bg-primary text-white' : 'hover-bg-light'}`
              }
              title={item.label} // Tooltip on collapsed
            >
              <i className={`bi ${item.icon} me-2 fs-5`}></i>
              {expanded && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
