import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import MatchCard from '../components/MatchCard'

export default function MatchPage() {
  const auth = useAuth()
  const myId = auth.user?.id

  const myOffers = useMemo(() => auth.skills.filter((s) => s.ownerId === myId && s.type === 'offer'), [auth.skills, myId])
  const myWants = useMemo(() => auth.skills.filter((s) => s.ownerId === myId && s.type === 'want'), [auth.skills, myId])

  const matches = useMemo(() => {
    if (!myId) return []
    const offersMatched = myOffers
      .flatMap((offer) =>
        auth.skills.filter(
          (candidate) =>
            candidate.ownerId !== myId &&
            candidate.type === 'want' &&
            candidate.title.toLowerCase() === offer.title.toLowerCase(),
        ),
      )

    const reverse = myWants
      .flatMap((want) =>
        auth.skills.filter(
          (candidate) =>
            candidate.ownerId !== myId &&
            candidate.type === 'offer' &&
            candidate.title.toLowerCase() === want.title.toLowerCase(),
        ),
      )

    const map = new Map<string, any>()
    offersMatched.forEach((skill) => {
      map.set(skill.id, skill)
    })
    reverse.forEach((skill) => {
      map.set(skill.id, skill)
    })

    return Array.from(map.values())
  }, [auth.skills, myOffers, myWants, myId])

  return (
    <main className="page">
      <h2>Suggestions de matching</h2>
      <section className="skills-grid">
        {matches.length === 0 ? (
          <p>Aucune suggestion pour le moment. Ajoutez plus de compétences offre/demande pour découvrir des matches !</p>
        ) : (
          matches.map((skill, index) => (
            <div key={skill.id} className="fade-in-up stagger" style={{ '--i': index } as React.CSSProperties}>
              <MatchCard skill={skill} compatibility={Math.floor(Math.random() * 20) + 80} />
            </div>
          ))
        )}
      </section>
    </main>
  )
}
