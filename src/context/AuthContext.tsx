import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Skill, User } from '../types'

type AuthState = {
  user: User | null
  token: string | null
  skills: Skill[]
}

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (profile: Partial<User>) => void
  addSkill: (skill: Omit<Skill, 'id' | 'ownerId'>) => void
  updateSkill: (id: string, data: Partial<Omit<Skill, 'id' | 'ownerId'>>) => void
  deleteSkill: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'skillswap_auth'
const SKILLS_KEY = 'skillswap_skills'

const sampleSkills: Skill[] = [
  {
    id: 's1',
    title: 'Figma',
    category: 'Design',
    level: 'Intermédiaire',
    type: 'offer',
    description: 'Création d’interfaces et prototypes',
    ownerId: 'u1',
  },
  {
    id: 's2',
    title: 'Guitare',
    category: 'Musique',
    level: 'Débutant',
    type: 'want',
    description: 'Apprendre accords et rythmes de base',
    ownerId: 'u1',
  },
  {
    id: 's3',
    title: 'Guitare',
    category: 'Musique',
    level: 'Avancé',
    type: 'offer',
    description: 'Cours de guitare acoustique',
    ownerId: 'u2',
  },
  {
    id: 's4',
    title: 'Figma',
    category: 'Design',
    level: 'Débutant',
    type: 'want',
    description: 'Apprendre création de maquettes',
    ownerId: 'u2',
  },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedSkills = localStorage.getItem(SKILLS_KEY)
    return {
      user: saved ? (JSON.parse(saved) as User) : null,
      token: saved ? 'fake-jwt-token' : null,
      skills: savedSkills ? (JSON.parse(savedSkills) as Skill[]) : sampleSkills,
    }
  })

  useEffect(() => {
    if (auth.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth.user))
      localStorage.setItem(SKILLS_KEY, JSON.stringify(auth.skills))
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(SKILLS_KEY)
    }
  }, [auth])

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis')
    }
    const user: User = {
      id: 'u1',
      name: 'Alice',
      email,
      bio: 'J’adore partager mes compétences.',
      avatarUrl: 'https://i.pravatar.cc/120?img=12',
    }
    setAuth({ ...auth, user, token: 'fake-jwt-token' })
  }

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error('Nom, email et mot de passe requis')
    }
    const user: User = {
      id: 'u1',
      name,
      email,
      bio: 'Nouveau membre SkillSwap',
      avatarUrl: 'https://i.pravatar.cc/120?img=24',
    }
    setAuth({ ...auth, user, token: 'fake-jwt-token', skills: sampleSkills })
  }

  const logout = () => {
    setAuth({ user: null, token: null, skills: auth.skills })
  }

  const updateProfile = (profile: Partial<User>) => {
    if (!auth.user) return
    const user = { ...auth.user, ...profile }
    setAuth({ ...auth, user })
  }

  const addSkill = (partial: Omit<Skill, 'id' | 'ownerId'>) => {
    if (!auth.user) return
    const skill: Skill = {
      ...partial,
      id: `s-${Date.now()}`,
      ownerId: auth.user.id,
    }
    setAuth({ ...auth, skills: [...auth.skills, skill] })
  }

  const updateSkill = (id: string, data: Partial<Omit<Skill, 'id' | 'ownerId'>>) => {
    const s = auth.skills.find((x) => x.id === id)
    if (!s || !auth.user || s.ownerId !== auth.user.id) return
    const skills = auth.skills.map((x) => (x.id === id ? { ...x, ...data } : x))
    setAuth({ ...auth, skills })
  }

  const deleteSkill = (id: string) => {
    if (!auth.user) return
    setAuth({ ...auth, skills: auth.skills.filter((x) => x.id !== id) })
  }

  const value = useMemo(
    () => ({ ...auth, login, register, logout, updateProfile, addSkill, updateSkill, deleteSkill }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
