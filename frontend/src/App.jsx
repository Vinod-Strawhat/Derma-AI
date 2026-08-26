import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import SkinCheck from './pages/SkinCheck'
import Results from './pages/Results'
import History from './pages/History'
import Compare from './pages/Compare'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Disclaimer from './pages/Disclaimer'
import PrivacyDataUse from './pages/PrivacyDataUse'
import Research from './pages/Research'
import HelpCenter from './pages/HelpCenter'
import { useTheme } from './context/ThemeContext'

function App() {
  const location = useLocation()
  const { darkMode } = useTheme()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location.pathname, location.hash])

  const isDashboardArea = [
    '/dashboard',
    '/skin-check',
    '/results',
    '/history',
    '/compare',
    '/profile',
  ].includes(location.pathname)

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#07111F] text-gray-100' : 'bg-gray-50/50 text-gray-900'}`}>
      <Header variant={isDashboardArea ? 'dashboard' : 'public'} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skin-check" element={<SkinCheck />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<History />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-data-use" element={<PrivacyDataUse />} />
          <Route path="/research" element={<Research />} />
          <Route path="/help" element={<HelpCenter />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App