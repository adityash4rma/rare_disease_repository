import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DiseaseRepository from './pages/DiseaseRepository';
import DatasetExplorer from './pages/DatasetExplorer';
import DiseaseDetail from './pages/DiseaseDetail';
import Research from './pages/Research';
import AccessRequests from './pages/AccessRequests';
import Onboarding from './pages/Onboarding';
import FederatedLearning from './pages/FederatedLearning';


const AppContent: FC = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/onboarding';

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] antialiased">
      {/* 1. Only show Sidebar if not on Onboarding page */}
      {!hideSidebar && <Sidebar />}
      
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/repository" element={<DiseaseRepository />} />
          <Route path="/datasets" element={<DatasetExplorer />} />
          <Route path="/studies" element={<Research />} />
          <Route path="/requests" element={<AccessRequests />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/disease/:id" element={<DiseaseDetail />} />
          <Route path="/federated" element={<FederatedLearning />} />
        </Routes>
      </main>
    </div>
  );
};

const App: FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;