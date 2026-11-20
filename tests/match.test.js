import { describe, expect, it } from 'vitest'
import { rankPets } from '../src/logic/match.js'

// 除过敏外七题全给最高档：空间、时间、经验、预算都给到顶，偏好都选最强。
const ALL_MAX = {
  housing: 5,
  time: 5,
  experience: 5,
  budget: 5,
  temperament: 5,
  shedding: 5,
  clinginess: 5,
}

const ALL_MIN = {
  housing: 1,
  time: 1,
  experience: 1,
  budget: 1,
  temperament: 1,
  shedding: 1,
  clinginess: 1,
}

describe('rankPets 完整答案', () => {
  it('无过敏键时按有效权重和 11 计分，返回前三', () => {
    const result = rankPets(ALL_MAX)
    expect(result.map((item) => item.petId)).toEqual(['dog', 'ferret', 'parrot'])
    // 狗 53/55、雪貂 50/55、鹦鹉 49/55，四舍五入后 96、91、89。
    expect(result.map((item) => item.percent)).toEqual([96, 91, 89])
  })

  it('七题全给最低档时，0 值 clamp 到 1 生效，乌龟/金鱼/守宫的掉毛与叫声按「完全没有」计满分', () => {
    const result = rankPets(ALL_MIN)
    // 守宫 55/55、金鱼 54/55、仓鼠 53/55。若不做 clamp，守宫只能到 53/55（96），
    // 金鱼 52/55（95），这里的 100 与 98 就是 clamp 的回归点。
    expect(result.map((item) => item.petId)).toEqual(['gecko', 'goldfish', 'hamster'])
    expect(result.map((item) => item.percent)).toEqual([100, 98, 96])
  })

  it('完全同分按原表顺序，鹦鹉排在荷兰猪之前', () => {
    const result = rankPets(ALL_MAX)
    // 鹦鹉与荷兰猪都是 49 分；原表里鹦鹉在前，所以第三名是鹦鹉不是荷兰猪。
    expect(result[2].petId).toBe('parrot')
  })

  it('有过敏键时把权重 3 也算进分母，趋低过敏源的类型排名上升', () => {
    const result = rankPets({ ...ALL_MAX, allergy: 3 })
    expect(result.map((item) => item.petId)).toEqual(['dog', 'parrot', 'turtle'])
    // 狗 53 + 2×3 = 59，59/70 = 84；鹦鹉 49 + 3×3 = 58，乌龟 43 + 5×3 = 58，都是 58/70 = 83。
    // 同为 58 分时鹦鹉原表在前，所以第二是鹦鹉不是乌龟。
    expect(result.map((item) => item.percent)).toEqual([84, 83, 83])
  })

  it('两个「有顾虑」选项的档位只是标记，改它不改结果', () => {
    const unsure = rankPets({ ...ALL_MAX, allergy: 3 })
    const confirmed = rankPets({ ...ALL_MAX, allergy: 2 })
    expect(confirmed).toEqual(unsure)
  })

  it('理由取契合分最高的一题，并列时先取权重高的', () => {
    const [dog] = rankPets(ALL_MAX)
    // 狗的住房、陪伴、经验、预算、粘人都是满分，其中陪伴权重 3 最高。
    expect(dog.reason).toBe('你每天能陪的时间，够它用的。')
  })

  it('返回结构固定为 petId、percent、reason', () => {
    const [first] = rankPets(ALL_MAX)
    expect(Object.keys(first).sort()).toEqual(['percent', 'petId', 'reason'])
    expect(Number.isInteger(first.percent)).toBe(true)
    expect(first.percent).toBeGreaterThanOrEqual(0)
    expect(first.percent).toBeLessThanOrEqual(100)
  })
})

describe('rankPets 无效答案', () => {
  it('除过敏外少任一道题都返回空数组', () => {
    for (const id of Object.keys(ALL_MAX)) {
      const answers = { ...ALL_MAX }
      delete answers[id]
      expect(rankPets(answers)).toEqual([])
    }
  })

  it('过敏缺键不算缺答，其余七题齐全就正常出结果', () => {
    expect(rankPets(ALL_MAX)).toHaveLength(3)
  })

  it('档位超出 1–5、不是整数或不是数字都返回空数组', () => {
    expect(rankPets({ ...ALL_MAX, housing: 0 })).toEqual([])
    expect(rankPets({ ...ALL_MAX, housing: 6 })).toEqual([])
    expect(rankPets({ ...ALL_MAX, housing: 2.5 })).toEqual([])
    expect(rankPets({ ...ALL_MAX, housing: '5' })).toEqual([])
    expect(rankPets({ ...ALL_MAX, allergy: 0 })).toEqual([])
  })

  it('空值、数组和字符串都返回空数组', () => {
    expect(rankPets(null)).toEqual([])
    expect(rankPets(undefined)).toEqual([])
    expect(rankPets([])).toEqual([])
    expect(rankPets('housing')).toEqual([])
  })
})
