export interface DailyStats {
  date: string
  reviewed: number
  mastered: number
  newWords: number
}

export interface Progress {
  totalWords: number
  totalDecks: number
  streak: number
  dailyStats: DailyStats[]
}

export interface ReviewSessionStats {
  totalCards: number
  reviewedCards: number
  correctCards: number
  incorrectCards: number
  startTime: Date
  endTime?: Date
}
