import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import type { ReactElement } from 'react'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import DiseaseRepository from './pages/DiseaseRepository'
import DatasetExplorer from './pages/DatasetExplorer'
import DiseaseDetail from './pages/DiseaseDetail'
import { SignUp } from './pages/SignUp'

const SignUpPage = SignUp as unknown as () => ReactElement

const AppRoutes = () => {
  const location = useLocation()
  const isSignupPage = location.pathname === '/signup'

  if (isSignupPage) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] antialiased">
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