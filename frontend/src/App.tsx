import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DiseaseRepository from './pages/DiseaseRepository';
import DatasetExplorer from './pages/DatasetExplorer';
import DiseaseDetail from './pages/DiseaseDetail';

const App: FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F4F7FE] antialiased">
        {/* The Sidebar stays on the screen at all times */}
        <Sidebar />
        
        {/* The Routes decide which page shows up in the remaining space */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/repository" element={<DiseaseRepository />} />
            <Route path="/datasets" element={<DatasetExplorer />} />
            <Route path="/disease/:id" element={<DiseaseDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;