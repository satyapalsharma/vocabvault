export interface Deck {
  id: string
  name: string
  description?: string
  cardIds: string[]
  createdAt: Date
  updatedAt: Date
}
