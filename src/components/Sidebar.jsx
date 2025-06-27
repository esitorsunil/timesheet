import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function TimesheetSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const timesheetItems = [
    { path: "/daily", label: "Daily", initial: "D" },
    { path: "/weekly", label: "Weekly", initial: "W" },
    { path: "/bi-weekly", label: "Bi-Weekly", initial: "B" },
    { path: "/monthly", label: "Monthly", initial: "M" },
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
              width: expanded ? '150px' : '23px',
              objectFit: 'contain',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
        <button
          className="btn btn-sm rounded-circle ms-auto"
          style={{
            border: '1px solid rgb(32, 190, 173)',
            color: 'rgb(32, 190, 173)'
          }}
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
        >
          <i className={`bi bi-chevron-${expanded ? 'left' : 'right'}`}></i>
        </button>
      </div>

      <div
        className="logo-area px-3 mb-3 d-flex align-items-center justify-content-between text-white rounded"
        style={{
          cursor: 'pointer',
          backgroundColor: showDropdown ? 'rgb(32, 190, 173)' : 'transparent',
          padding: showDropdown ? '0.5rem' : '',
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="d-flex align-items-center">
          <img
            src="https://demo.apploye.com/static/media/timesheet.487c645f72e4ed76e84f2a4713055d04.svg"
            alt="timesheet icon"
            style={{
              height: '24px',
              width: '24px',
              marginRight: '8px',
              filter: showDropdown ? 'invert(100%) brightness(200%) contrast(100%)' : 'none'
            }}
          />
          {expanded && <span>Timesheet</span>}
        </div>
        <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'}`}></i>
      </div>

      {showDropdown && (
        <nav className="nav flex-column px-2">
          {timesheetItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="nav-link d-flex align-items-center py-2 px-2 rounded mb-1 hover-bg-light"
              title={item.label}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="sc-sLsrZ eFDrVH me-2 ms-3"
                    style={{
                      border: isActive ? 'none' : '1px solid #ccc',
                      backgroundColor: isActive ? 'rgb(32, 190, 173)' : '#6c757d',
                      color: 'white'
                    }}
                  >
                    {item.label.charAt(0)}
                  </div>
                  {expanded && (
                    <span
                      style={{
                        color: isActive ? 'rgb(32, 190, 173)' : '#6c757d'
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
