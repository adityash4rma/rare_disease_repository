import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DiseaseRepository from './pages/DiseaseRepository';
import DatasetExplorer from './pages/DatasetExplorer';


const App: FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F4F7FE] antialiased">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/repository" element={<DiseaseRepository />} />
          <Route path="/datasets" element={<DatasetExplorer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;