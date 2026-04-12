import type { QuizQuestion } from '../components/Quiz'
import { aifC01Questions } from './practice/aifC01'

export interface PracticeQuestion extends QuizQuestion {
  categoryId: string
  explanationEn?: string
}

export const allQuestions: PracticeQuestion[] = [
  ...aifC01Questions,
]

export function getQuestionsByCategory(categoryId: string): PracticeQuestion[] {
  return allQuestions.filter(q => q.categoryId === categoryId)
}
