import { listPets } from '../data/catalog.js'
import { listBreeds } from './breedCatalog.js'

// 架构 §4 定版的权重，合计 14；过敏跳过时有效权重和取 11。
const WEIGHTS = {
  housing: 2,
  time: 3,
  experience: 1,
  allergy: 3,
  budget: 2,
  temperament: 1,
  shedding: 1,
  clinginess: 1,
}

// 题序与 questions.js 一致：理由并列时先比权重，再按这个顺序取。
const QUESTION_ORDER = [
  'housing',
  'time',
  'experience',
  'allergy',
  'budget',
  'temperament',
  'shedding',
  'clinginess',
]

// 除过敏外七题齐全才算「答案完整」；allergy 缺键按整题跳过，不算缺答（架构 §4）。
const REQUIRED_QUESTIONS = QUESTION_ORDER.filter((id) => id !== 'allergy')

const TOP_N = 3

// 架构 §4「0 值处理」：乌龟、金鱼、守宫的掉毛和叫声在原表里记 0，含义是「完全没有」，
// 直接代进偏好型公式会让最安静的三种永远拿不到满分。数据文件保留原值 0（详情页照原值展示），
// 这里对读出来的副本夹到 1–5，0 按 1 算；其余维度原表最小值就是 1，clamp 是空操作。
const clampTier = (tier) => Math.min(5, Math.max(1, tier))

// 需求型：只看「不够」，用户给得比宠物需求多不扣分。
const needFit = (userTier, petTier) => 5 - Math.max(0, petTier - userTier)

// 偏好型：两头偏离都扣分。
const preferenceFit = (userTier, petTier) => 5 - Math.abs(userTier - petTier)

// 推荐理由：一线一句，正例讲最合拍的一维。
const REASONS = {
  housing: {
    strong: '你住的地方，装得下它的空间需求。',
    weak: '它对空间的要求，比你现在的住处能给的更高。',
  },
  time: {
    strong: '你每天能陪的时间，够它用的。',
    weak: '它需要的陪伴时间，比你每天能挤出来的多。',
  },
  experience: {
    strong: '它这个饲养难度，你的经验接得住。',
    weak: '它比你现在能应付的难度更考验经验。',
  },
  allergy: {
    strong: '在过敏这件事上，它对你比较友好。',
    weak: '它对毛和皮屑的友好度偏低，有顾虑要多想一步。',
  },
  budget: {
    strong: '它的月花费，落在你能接受的范围里。',
    weak: '它的月花费，会超出你的预算档。',
  },
  temperament: {
    strong: '它的动静，和你喜欢的安静或活泼对得上。',
    weak: '它的动静，和你喜欢的安静或活泼差得有点远。',
  },
  shedding: {
    strong: '它掉的毛，在你忍得住的量里。',
    weak: '它掉的毛，比你表示能接受的多。',
  },
  clinginess: {
    strong: '它粘人的程度，和你要的差不多。',
    weak: '它粘人的程度，和你期待的有落差。',
  },
}

const isValidTier = (value) => Number.isInteger(value) && value >= 1 && value <= 5

// answers 是 readAnswerScores() 的字典：题 id → 1–5 档。
function isAnswerScores(answers) {
  if (answers === null || typeof answers !== 'object' || Array.isArray(answers)) return false
  if (!REQUIRED_QUESTIONS.every((id) => isValidTier(answers[id]))) return false
  // 过敏给了键就必须是合法档位；缺键是「跳过」的正常形态，不是坏数据。
  return answers.allergy === undefined || isValidTier(answers.allergy)
}

// 每只宠物八道题的契合分。宠物属性都先 clamp 到副本上，不写回任何数据文件。
function fitsOf(pet, answers) {
  const fits = {
    housing: needFit(answers.housing, clampTier(pet.spaceNeed)),
    time: needFit(answers.time, clampTier(pet.companionshipNeed)),
    experience: needFit(answers.experience, clampTier(pet.difficulty)),
    budget: needFit(answers.budget, clampTier(pet.costTier)),
    // 安静或活泼是双维：叫声、运动量各算一次偏好分再取平均，整题仍只占权重 1。
    temperament:
      (preferenceFit(answers.temperament, clampTier(pet.noise)) +
        preferenceFit(answers.temperament, clampTier(pet.activity))) /
      2,
    shedding: preferenceFit(answers.shedding, clampTier(pet.shedding)),
    clinginess: preferenceFit(answers.clinginess, clampTier(pet.clinginess)),
  }
  // 有顾虑时契合分直接取过敏友好度原档，用户档位不进距离公式（架构 §4）。
  if (answers.allergy !== undefined) fits.allergy = clampTier(pet.allergyFriendly)
  return fits
}

// 取契合分最高的一题；并列先取权重高的，再并列按题序（activeIds 已是题序）。
// 最高分也只有 3 分或更低时，这条推荐没有说服力，改成指出最大短板，避免误导。
function reasonOf(activeIds, fits) {
  let best = activeIds[0]
  for (const id of activeIds.slice(1)) {
    if (fits[id] > fits[best] || (fits[id] === fits[best] && WEIGHTS[id] > WEIGHTS[best])) best = id
  }
  if (fits[best] > 3) return REASONS[best].strong

  let worst = activeIds[0]
  for (const id of activeIds.slice(1)) {
    if (fits[id] < fits[worst] || (fits[id] === fits[worst] && WEIGHTS[id] > WEIGHTS[worst])) worst = id
  }
  return REASONS[worst].weak
}

// 架构 §3：完整有效时返回三项 { petId, percent, reason }；
// 除过敏外七题的键不齐或含无效档位时返回空数组，由 A 判空回问卷。
export function rankPets(answers) {
  if (!isAnswerScores(answers)) return []

  const activeIds = QUESTION_ORDER.filter((id) => id !== 'allergy' || answers.allergy !== undefined)
  const weightTotal = activeIds.reduce((sum, id) => sum + WEIGHTS[id], 0)

  const scored = listPets().map((pet, index) => {
    const fits = fitsOf(pet, answers)
    const sum = activeIds.reduce((total, id) => total + fits[id] * WEIGHTS[id], 0)
    return { pet, index, fits, sum, ratio: sum / weightTotal }
  })

  // 用未取整的比值排序，避免四舍五入后同分错序；完全同分时按原表顺序（listPets 的顺序）。
  scored.sort((a, b) => b.ratio - a.ratio || a.index - b.index)

  return scored.slice(0, TOP_N).map(({ pet, fits, sum }) => ({
    petId: pet.id,
    percent: Math.round((sum / (5 * weightTotal)) * 100),
    reason: reasonOf(activeIds, fits),
  }))
}

// 架构 §4.1：品种级二次匹配。权重和契合分沿用 §4，属性档从类型表换成品种表；
// 排序、取整与理由口径和 rankPets 一致，同分按 breeds.json 里的行序。无品种数据或答案无效时返回空数组。
export function rankBreeds(typeId, answers) {
  const breeds = listBreeds(typeId)
  if (breeds.length === 0 || !isAnswerScores(answers)) return []

  const activeIds = QUESTION_ORDER.filter((id) => id !== 'allergy' || answers.allergy !== undefined)
  const weightTotal = activeIds.reduce((sum, id) => sum + WEIGHTS[id], 0)

  return breeds
    .map((breed, index) => {
      const fits = fitsOf(breed, answers)
      const sum = activeIds.reduce((total, id) => total + fits[id] * WEIGHTS[id], 0)
      return { breed, index, fits, sum, ratio: sum / weightTotal }
    })
    .sort((a, b) => b.ratio - a.ratio || a.index - b.index)
    .map(({ breed, fits, sum }) => ({
      breedId: breed.id,
      percent: Math.round((sum / (5 * weightTotal)) * 100),
      reason: reasonOf(activeIds, fits),
      feature: breed.personality,
    }))
}
