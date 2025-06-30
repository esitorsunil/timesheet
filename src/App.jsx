import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Daily from './pages/Daily';
import Weekly from './pages/Weekly';
import TimesheetSidebar from './components/Sidebar';
import BiWeekly from './pages/BiWeekly';
import Monthly from './pages/Monthly';


function App() {
  return (

    <Router>
      <div style={{ display: 'flex' }}>
        <TimesheetSidebar />
        <div className='bg-light' style={{ flex: 1}}>
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
