import { describe, expect, it } from 'vitest'
import breedsData from '../src/data/breeds.json'
import { hasBreeds, listBreeds } from '../src/logic/breedCatalog.js'
import { rankBreeds } from '../src/logic/match.js'
import { toAnswerScores } from '../src/logic/quizSession.js'

// 数据来源：第一批是 B 2026-11-20 交付的 4 个品种 CSV（A 代转），第二批是 B 2026-11-21 补的龟/仓鼠/守宫 9 个，第三批是 B 2026-11-24 补的金鱼/龙猫/荷兰猪/雪貂 12 个（后两批每个带 source 注明寿命依据）。
// 这里独立重算一遍契合分与排序，确认 rankBreeds 的口径与 §4 / §4.1 一致，不引用 match.js 内部函数。
const WEIGHTS = { housing: 2, time: 3, experience: 1, allergy: 3, budget: 2, temperament: 1, shedding: 1, clinginess: 1 }
const ORDER = ['housing', 'time', 'experience', 'allergy', 'budget', 'temperament', 'shedding', 'clinginess']
const clamp = (t) => Math.min(5, Math.max(1, t))
const needFit = (u, p) => 5 - Math.max(0, p - u)
const prefFit = (u, p) => 5 - Math.abs(u - p)

function handPercent(breed, scores) {
  const active = ORDER.filter((id) => scores[id] !== undefined)
  const fits = {
    housing: needFit(scores.housing, clamp(breed.spaceNeed)),
    time: needFit(scores.time, clamp(breed.companionshipNeed)),
    experience: needFit(scores.experience, clamp(breed.difficulty)),
    budget: needFit(scores.budget, clamp(breed.costTier)),
    temperament: (prefFit(scores.temperament, clamp(breed.noise)) + prefFit(scores.temperament, clamp(breed.activity))) / 2,
    shedding: prefFit(scores.shedding, clamp(breed.shedding)),
    clinginess: prefFit(scores.clinginess, clamp(breed.clinginess)),
  }
  if (scores.allergy !== undefined) fits.allergy = clamp(breed.allergyFriendly)
  const sum = active.reduce((total, id) => total + fits[id] * WEIGHTS[id], 0)
  return { percent: Math.round((sum / (5 * active.reduce((t, id) => t + WEIGHTS[id], 0))) * 100), sum }
}

const GROUP_B = toAnswerScores({
  housing: 'two-bed', time: 'gt-4h', experience: 'some', allergy: 'none',
  budget: 'lt-400', temperament: 'lean-active', shedding: 'any-hair', clinginess: 'very-clingy',
})
const GROUP_C = toAnswerScores({
  housing: 'one-bed', time: '2-4h', experience: 'some', allergy: 'confirmed',
  budget: 'lt-200', temperament: 'lean-quiet', shedding: 'no-hair', clinginess: 'moderate',
})

describe('breeds.json（B 的第一批 + 11-21 第二批 + 11-24 第三批）', () => {
  it('45 个品种、11 个类型、id 唯一、档位合法、花费全部待核', () => {
    const breeds = breedsData.breeds
    expect(breeds).toHaveLength(45)
    expect(new Set(breeds.map((b) => b.id)).size).toBe(45)
    expect(breeds.reduce((acc, b) => acc.add(b.typeId), new Set())).toEqual(
      new Set(['dog', 'cat', 'rabbit', 'parrot', 'turtle', 'hamster', 'gecko', 'goldfish', 'chinchilla', 'guinea-pig', 'ferret']),
    )
    // 掉毛和叫声允许 0（「完全没有」），其余六维必须是 1–5 的整数；
    // 0 值由 match.js 在读取层 clamp 到 1，这里只守数据文件本身的取值范围。
    const ZERO_ALLOWED = new Set(['shedding', 'noise'])
    for (const breed of breeds) {
      for (const key of ['difficulty', 'spaceNeed', 'companionshipNeed', 'shedding', 'noise', 'clinginess', 'activity', 'allergyFriendly']) {
        const min = ZERO_ALLOWED.has(key) ? 0 : 1
        expect(Number.isInteger(breed[key]) && breed[key] >= min && breed[key] <= 5, `${breed.id}.${key}`).toBe(true)
      }
      expect(breed.costPending, breed.id).toBe(true)
      expect(breed.monthlyCost, breed.id).toMatch(/待核/)
      expect(breed.name && breed.personality && breed.lifespan, breed.id).toBeTruthy()
      // 第二批（龟 / 仓鼠 / 守宫）与第三批（金鱼 / 龙猫 / 荷兰猪 / 雪貂）必须写清楚寿命依据。
      if (['turtle', 'hamster', 'gecko', 'goldfish', 'chinchilla', 'guinea-pig', 'ferret'].includes(breed.typeId)) {
        expect(breed.source, breed.id).toMatch(/寿命/)
      }
    }
  })

  it('入口只看数据：11 个类型有品种，只剩刺猬没有（刺猬不出品种）', () => {
    for (const typeId of ['dog', 'cat', 'rabbit', 'parrot', 'turtle', 'hamster', 'gecko', 'goldfish', 'chinchilla', 'guinea-pig', 'ferret']) {
      expect(hasBreeds(typeId), typeId).toBe(true)
    }
    for (const typeId of ['hedgehog']) {
      expect(hasBreeds(typeId), typeId).toBe(false)
      expect(listBreeds(typeId), typeId).toEqual([])
    }
  })
})

describe('rankBreeds', () => {
  it('没有品种数据、答案无效时返回空数组', () => {
    expect(rankBreeds('hedgehog', GROUP_B)).toEqual([])
    expect(rankBreeds('dog', {})).toEqual([])
    expect(rankBreeds('dog', null)).toEqual([])
  })

  for (const [label, scores] of [['过敏跳过 W=11', GROUP_B], ['过敏计入 W=14', GROUP_C]]) {
    it(`狗的全部品种按独立手算排序且百分比一致（${label}）`, () => {
      const breeds = listBreeds('dog')
      const expected = breeds
        .map((breed) => ({ id: breed.id, ...handPercent(breed, scores) }))
        .sort((a, b) => b.sum - a.sum)
      const got = rankBreeds('dog', scores)

      expect(got.map((item) => item.breedId)).toEqual(expected.map((item) => item.id))
      expect(got.map((item) => item.percent)).toEqual(expected.map((item) => item.percent))
      expect(got.map((item) => item.feature)).toEqual(got.map((item) => breeds.find((b) => b.id === item.breedId).personality))
      for (const item of got) expect(item.reason.length).toBeGreaterThan(0)
    })
  }

  it('品种页只列该类型的品种，十一个类型全都能算', () => {
    for (const typeId of ['dog', 'cat', 'rabbit', 'parrot', 'turtle', 'hamster', 'gecko', 'goldfish', 'chinchilla', 'guinea-pig', 'ferret']) {
      const got = rankBreeds(typeId, GROUP_B)
      expect(got, typeId).toHaveLength(listBreeds(typeId).length)
      expect(got.every((item) => item.percent >= 0 && item.percent <= 100), typeId).toBe(true)
    }
    expect(rankBreeds('parrot', GROUP_B).map((item) => item.breedId)).toHaveLength(4)
  })
})