import type { Skill } from '../types'

type MatchCardProps = {
  skill: Skill
  compatibility?: number // 0-100
}

export default function MatchCard({ skill, compatibility = 85 }: MatchCardProps) {
  return (
    <article className="skill-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(var(--brand-primary) ${compatibility * 3.6}deg, var(--bg-muted) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 'bold',
              fontSize: '18px',
              color: 'var(--brand-primary)'
            }}>
              {compatibility}%
            </span>
          </div>
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Compatibilité</h4>
        </div>
      </div>
      <h3>{skill.title}</h3>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <span className={`skill-tag ${skill.type}`}>
          {skill.type === 'offer' ? 'Offre' : 'Demande'}
        </span>
        <span className="skill-tag" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          {skill.category}
        </span>
      </div>
      <p>{skill.description}</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button className="btn-primary">Proposer échange</button>
        <button className="btn-ghost">Voir profil</button>
      </div>
    </article>
  )
}