export type SkillCategory =
  | 'Technologie'
  | 'Musique'
  | 'Langues'
  | 'Design'
  | 'Cuisine'
  | 'Sport'
  | 'Art'
  | 'Business'
  | 'Autre'

export type SkillLevel = 'Débutant' | 'Intermédiaire' | 'Avancé'
export type SkillType = 'offer' | 'want'

export interface Skill {
  id: string
  title: string
  category: SkillCategory
  level: SkillLevel
  type: SkillType
  description: string
  ownerId: string
}

export interface User {
  id: string
  name: string
  email: string
  bio: string
  avatarUrl: string
}
