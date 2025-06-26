// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Daily from './pages/Daily';
import Weekly from './pages/Weekly';
import BiWeekly from './pages/BiWeekly';
import Monthly from './pages/Monthly';
import TimesheetSidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <TimesheetSidebar />
        <div style={{ padding: '20px', flex: 1 }}>
          <Routes>
            <Route path="/daily" element={<Daily />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="/bi-weekly" element={<BiWeekly />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/" element={<Daily />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
