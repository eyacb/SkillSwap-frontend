import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

type AuthPageProps = {
  onNavigate: (page: 'home' | 'auth' | 'profile' | 'matches') => void
}

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const auth = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: any) => {
    e.preventDefault()
    try {
      setError('')
      if (mode === 'login') {
        await auth.login(email, password)
      } else {
        await auth.register(name, email, password)
      }
      onNavigate('profile')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <main className="page auth-page">
      <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
      <form onSubmit={submit} className="auth-form">
        {mode === 'register' && (
          <label>
            <span>Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          <span>Mot de passe</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="btn-primary">{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="link-button">
        {mode === 'login'
          ? "Je n'ai pas de compte"
          : 'J’ai déjà un compte'}
      </button>
    </main>
  )
}
