import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import DiseaseRepository from './pages/DiseaseRepository'
import DatasetExplorer from './pages/DatasetExplorer'
import DiseaseDetail from './pages/DiseaseDetail'
import { SignUp } from './pages/SignUp'
import Research from './pages/Research'

const AppRoutes = () => {
  const location = useLocation()

  if (location.pathname === '/signup') {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    )
  }

  if (
    location.pathname === '/studies' ||
    location.pathname === '/research'
  ) {
    return (
      <Routes>
        <Route path="/studies" element={<Research />} />
        <Route path="/research" element={<Research />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fd] antialiased">
      <Sidebar />

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/repository" element={<DiseaseRepository />} />
          <Route path="/datasets" element={<DatasetExplorer />} />
          <Route path="/disease/:id" element={<DiseaseDetail />} />
        </Routes>
      </div>
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default App