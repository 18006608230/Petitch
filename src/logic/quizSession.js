import { questions } from '../data/questions.js'

const STORAGE_KEY = 'petitch.answers.v1'

const validPairs = new Map(
  questions.map((question) => [question.id, new Set(question.options.map((option) => option.id))]),
)

const scoreByOption = new Map(
  questions.map((question) => [
    question.id,
    new Map(
      question.options
        // score 没填是等 B 的对照表；显式 null 是架构 §4 的跳过标记（过敏题「都没有」）。两者都不进字典。
        .filter((option) => option.score !== undefined && option.score !== null)
        .map((option) => [option.id, option.score]),
    ),
  ]),
)

// 架构 §3 的答案字典：键是题目 id，值是选项对应的 1–5 档。
// 原六题的映射等 B 的对照表，填完自动补齐，这里不用改。
// 架构 §4：allergy 键不在字典里就等于「无顾虑，整题跳过」，rankPets 按缺键处理，别在这里补默认值。
export function toAnswerScores(answers) {
  const scores = {}
  for (const [questionId, optionId] of Object.entries(answers ?? {})) {
    const score = scoreByOption.get(questionId)?.get(optionId)
    if (score !== undefined) scores[questionId] = score
  }
  return scores
}

export function readAnswerScores() {
  return toAnswerScores(readAnswers())
}

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
