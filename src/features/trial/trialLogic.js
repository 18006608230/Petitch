// 架构 §5：五张卡，每张按「能接受 / 勉强能忍 / 受不了」扣 0 / 5 / 20 分，忍受度从 100 起扣。
export const TOTAL_SCORE = 100

export const DEDUCTIONS = {
  accept: 0,
  tolerate: 5,
  reject: 20,
}

export const TRIAL_OPTIONS = [
  { id: 'accept', label: '能接受' },
  { id: 'tolerate', label: '勉强能忍' },
  { id: 'reject', label: '受不了' },
]

// 有专属卡的类型；余下七种统一用通用卡（架构 §5）。
export const OWN_TRIAL_PETS = ['dog', 'cat', 'rabbit', 'hamster', 'parrot']

export function deductionOf(optionId) {
  return DEDUCTIONS[optionId] ?? 0
}

export function scoreOf(answers) {
  const sum = Object.values(answers).reduce((total, optionId) => total + deductionOf(optionId), 0)
  return Math.max(0, TOTAL_SCORE - sum)
}

// 架构 §5：<60 劝退，60–85 含两端提醒，>85 适合。
export function verdictOf(score) {
  if (score < 60) return 'discourage'
  if (score <= 85) return 'warn'
  return 'suitable'
}

// 扣分回顾：只列真的扣了分的卡，附扣分数，供「提醒」档展示。
export function deductionBreakdown(answers) {
  return Object.entries(answers)
    .map(([scenarioId, optionId]) => ({ scenarioId, optionId, points: deductionOf(optionId) }))
    .filter((entry) => entry.points > 0)
}

// 按卡标识只记第一次确认：同一张卡再点确认不覆盖、不重复计分。
export function confirmCard(answers, scenarioId, optionId) {
  if (answers[scenarioId] !== undefined) return answers
  return { ...answers, [scenarioId]: optionId }
}

// 卡片图片：狗/猫/兔/仓鼠/鹦鹉用专属图，其余七种用通用图（public/images/trial/）。
export function imageFor(petId, index) {
  const kind = OWN_TRIAL_PETS.includes(petId) ? petId : 'generic'
  return `/images/trial/trial-${kind}-${index + 1}.webp`
}
