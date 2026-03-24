import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SkillCard from '../components/SkillCard'
import type { SkillCategory, SkillType, SkillLevel } from '../types'

const categories: SkillCategory[] = ['Technologie', 'Musique', 'Langues', 'Design', 'Cuisine', 'Sport', 'Art', 'Business', 'Autre']
const levels: SkillLevel[] = ['Débutant', 'Intermédiaire', 'Avancé']
const types: SkillType[] = ['offer', 'want']

export default function HomePage() {
  const { skills } = useAuth()
  const [category, setCategory] = useState<string>('')
  const [level, setLevel] = useState<string>('')
  const [type, setType] = useState<string>('')

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
      if (category && skill.category !== category) return false
      if (level && skill.level !== level) return false
      if (type && skill.type !== type) return false
      return true
    })
  }, [skills, category, level, type])

  return (
    <main className="page">
      <h2>Catalogue de compétences</h2>
      <section className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Tous niveaux</option>
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous types</option>
          {types.map((t) => <option key={t} value={t}>{t === 'offer' ? 'Offre' : 'Demande'}</option>)}
        </select>
      </section>

      <section className="skills-grid">
        {filtered.length === 0 ? (
          <p>Aucune compétence trouvée.</p>
        ) : (
          filtered.map((skill, index) => (
            <div key={skill.id} className="fade-in-up stagger" style={{ '--i': index } as React.CSSProperties}>
              <SkillCard skill={skill} />
            </div>
          ))
        )}
      </section>
    </main>
  )
}
