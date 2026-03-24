import {  useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SkillCard from '../components/SkillCard'

const categories = ['Technologie', 'Musique', 'Langues', 'Design', 'Cuisine', 'Sport', 'Art', 'Business', 'Autre']
const levels = ['Débutant', 'Intermédiaire', 'Avancé']

export default function ProfilePage() {
  const auth = useAuth()
  const [name, setName] = useState(auth.user?.name ?? '')
  const [bio, setBio] = useState(auth.user?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(auth.user?.avatarUrl ?? '')
  const [error, setError] = useState('')

  const mySkills = useMemo(() => auth.skills.filter((s) => s.ownerId === auth.user?.id), [auth.skills, auth.user?.id])

  const [newSkill, setNewSkill] = useState({ title: '', category: 'Technologie', level: 'Débutant', type: 'offer', description: '' })

  const saveProfile = (e: any) => {
    e.preventDefault()
    try {
      auth.updateProfile({ name, bio, avatarUrl })
      setError('')
    } catch (err) {
      setError('Impossible de mettre à jour le profil')
    }
  }

  const addSkill = (e: any) => {
    e.preventDefault()
    if (!newSkill.title || !newSkill.description) {
      setError('Titre et description requis')
      return
    }
    auth.addSkill({ ...newSkill, category: newSkill.category as any, level: newSkill.level as any, type: newSkill.type as any })
    setNewSkill({ title: '', category: 'Technologie', level: 'Débutant', type: 'offer', description: '' })
  }

  if (!auth.user) return <p>Utilisateur non authentifié</p>

  return (
    <main className="page profile-page">
      <h2>Mon profil</h2>
      <section className="profile-card">
        <img src={auth.user.avatarUrl} alt="Avatar" className="avatar" />
        <h3>{auth.user.name}</h3>
        <p>{auth.user.bio}</p>
      </section>

      <form onSubmit={saveProfile} className="profile-form">
        <label>
          <span>Nom</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          <span>Bio</span>
          <input value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <label>
          <span>Avatar URL</span>
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </label>
        <button type="submit" className="btn-primary">Mettre à jour</button>
      </form>

      <h2>Mes compétences</h2>
      <section className="skills-grid">
        {mySkills.map((s) => <SkillCard key={s.id} skill={s} onDelete={auth.deleteSkill} />)}
      </section>

      <h3>Ajouter une compétence</h3>
      <form onSubmit={addSkill} className="skill-form">
        <label>
          <span>Titre</span>
          <input value={newSkill.title} onChange={(e) => setNewSkill((p) => ({ ...p, title: e.target.value }))} required />
        </label>
        <label>
          <span>Catégorie</span>
          <select value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Niveau</span>
          <select value={newSkill.level} onChange={(e) => setNewSkill((p) => ({ ...p, level: e.target.value }))}>
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label>
          <span>Type</span>
          <select value={newSkill.type} onChange={(e) => setNewSkill((p) => ({ ...p, type: e.target.value as 'offer' | 'want' }))}>
            <option value="offer">Offre</option>
            <option value="want">Demande</option>
          </select>
        </label>
        <label>
          <span>Description</span>
          <textarea value={newSkill.description} onChange={(e) => setNewSkill((p) => ({ ...p, description: e.target.value }))} required />
        </label>
        <button type="submit" className="btn-primary">Ajouter</button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  )
}
