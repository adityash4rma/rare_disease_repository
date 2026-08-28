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
import Institutions from './pages/Institutions';
import FederatedLearning from './pages/FederatedLearning';
import Login from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrapper to handle layout logic
const AppContent: FC = () => {
  const location = useLocation();

  // Pages that should NOT show the sidebar
  const hideSidebarPaths = ['/onboarding', '/login', '/signup'];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] antialiased">
      {/* Show Sidebar only if the current path isn't in the hide list */}
      {!shouldHideSidebar && <Sidebar />}
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Routes>
          {/* Main Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Main Navigation Pages */}
          <Route path="/repository" element={<DiseaseRepository />} />
          <Route path="/datasets" element={<DatasetExplorer />} />
          <Route path="/studies" element={<Research />} />
          <Route path="/research" element={<Research />} />
          <Route path="/requests" element={<AccessRequests />} />
          <Route path="/federated" element={<FederatedLearning />} />
          <Route path="/institutions" element={<Institutions />} />
          
          {/* Deep Dive Pages */}
          <Route path="/disease/:id" element={<DiseaseDetail />} />
          
          {/* Full Screen Pages (No Sidebar) */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

const App: FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;