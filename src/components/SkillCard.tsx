import type { Skill } from '../types'

type SkillCardProps = {
  skill: Skill
  onDelete?: (id: string) => void
}

export default function SkillCard({ skill, onDelete }: SkillCardProps) {
  return (
    <article className="skill-card">
      <h3>{skill.title}</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <span className={`skill-tag ${skill.type}`}>
          {skill.type === 'offer' ? 'Offre' : 'Demande'}
        </span>
        <span className="skill-tag" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          {skill.category}
        </span>
        <span className="skill-tag" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          {skill.level}
        </span>
      </div>
      <p>{skill.description}</p>
      {onDelete && <button className="btn-danger" style={{ marginTop: '16px' }} onClick={() => onDelete(skill.id)}>Supprimer</button>}
    </article>
  )
}
