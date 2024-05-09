export interface SRSConfig {
  initialInterval: number
  easyBonus: number
  hardFactor: number
  lapsePenalty: number
  minimumEaseFactor: number
}

export interface ReviewResult {
  quality: number
  nextInterval: number
  nextEaseFactor: number
  nextRepetitions: number
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

export const DEFAULT_SRS_CONFIG: SRSConfig = {
  initialInterval: 1,
  easyBonus: 1.3,
  hardFactor: 1.2,
  lapsePenalty: 0.2,
  minimumEaseFactor: 1.3,
}
