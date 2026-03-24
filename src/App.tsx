import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import MatchPage from './pages/MatchPage'
import AuthPage from './pages/AuthPage'
import './App.css'

function AppContent() {
  const auth = useAuth()
  const [page, setPage] = useState<'home' | 'auth' | 'profile' | 'matches'>('home')

  const handleNav = (target: 'home' | 'auth' | 'profile' | 'matches') => {
    if (target === 'profile' || target === 'matches') {
      if (!auth.user) {
        setPage('auth')
        return
      }
    }
    setPage(target)
  }

  return (
    <>
      <Navbar activePage={page} onNavigate={handleNav} />
      {page === 'home' && <HomePage />}
      {page === 'auth' && <AuthPage onNavigate={setPage} />}
      {page === 'profile' && auth.user && <ProfilePage />}
      {page === 'matches' && auth.user && <MatchPage />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
