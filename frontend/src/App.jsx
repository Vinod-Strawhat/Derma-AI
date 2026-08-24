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

function App() {
  const location = useLocation()

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
    <div className="min-h-screen flex flex-col bg-gray-50/50">
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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App