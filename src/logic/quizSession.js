import { questions } from '../data/questions.js'

const STORAGE_KEY = 'petitch.answers.v1'

const validPairs = new Map(
  questions.map((question) => [question.id, new Set(question.options.map((option) => option.id))]),
)

function isAnswerSet(answers) {
  return (
    answers !== null &&
    typeof answers === 'object' &&
    !Array.isArray(answers) &&
    Object.entries(answers).every(
      ([questionId, optionId]) => validPairs.has(questionId) && validPairs.get(questionId).has(optionId),
    )
  )
}

export function readAnswers() {
  let raw
  try {
    raw = sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return {}
  }
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return isAnswerSet(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export function saveAnswers(answers) {
  if (!isAnswerSet(answers)) return false
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    return false
  }
  return true
}

export function clearAnswers() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 隐私模式下存储不可用，清不掉也只影响本轮，不阻断流程。
  }
}

export function isComplete(answers) {
  const current = answers ?? readAnswers()
  return questions.every((question) => current[question.id] !== undefined)
}
