import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

type NavbarProps = {
  activePage: 'home' | 'auth' | 'profile' | 'matches'
  onNavigate: (page: 'home' | 'auth' | 'profile' | 'matches') => void
}

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const auth = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const onLogout = () => {
    auth.logout()
    onNavigate('auth')
    setIsOpen(false)
  }

  const handleNavigate = (page: 'home' | 'auth' | 'profile' | 'matches') => {
    onNavigate(page)
    setIsOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <h1>SkillSwap</h1>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <nav className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <button onClick={() => handleNavigate('home')} disabled={activePage === 'home'}>
            Catalogue
          </button>
          {auth.user && (
            <>
              <button onClick={() => handleNavigate('profile')} disabled={activePage === 'profile'}>
                Profil
              </button>
              <button onClick={() => handleNavigate('matches')} disabled={activePage === 'matches'}>
                Matches
              </button>
            </>
          )}
          {!auth.user ? (
            <button onClick={() => handleNavigate('auth')} disabled={activePage === 'auth'}>
              Se connecter
            </button>
          ) : (
            <button onClick={onLogout}>Déconnexion</button>
          )}
        </nav>
      </div>
    </header>
  )
}
