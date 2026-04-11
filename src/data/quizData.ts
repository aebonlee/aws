import type { QuizQuestion } from '../components/Quiz'
import { aifC01Questions } from './practice/aifC01'

export interface PracticeQuestion extends QuizQuestion {
  categoryId: string
}

export const allQuestions: PracticeQuestion[] = [
  ...aifC01Questions,
]
