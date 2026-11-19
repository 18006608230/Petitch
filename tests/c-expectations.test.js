import { describe, expect, it } from 'vitest'
import { listPets } from '../src/data/catalog.js'
import { rankPets } from '../src/logic/match.js'
import { toAnswerScores } from '../src/logic/quizSession.js'

// 数据来源：docs/03-C-1119-独立预期.md（作者 C，2026-11-19 手算，未调用 rankPets）。
// 行格式：[住房, 陪伴, 经验, 过敏, 预算, 安静活泼, 掉毛, 粘人, S, 百分比]；
// 过敏为 null 表示「都没有」跳过，整题不进字典也不计权重。
//
// 公式是本文件独立写的第二实现（docs/00 §4 / docs/02 §2），不 import match.js 内部函数：
// 改公式必须两边一起改，B 单边改这里会先红——这是故意的。
// 理由断言是 C 文档第 2 节的快照；B 修理由规则时同步更新这里。

const clamp = (tier) => Math.min(5, Math.max(1, tier))
const needFit = (userTier, petTier) => 5 - Math.max(0, petTier - userTier)
const preferenceFit = (userTier, petTier) => 5 - Math.abs(userTier - petTier)

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

const ORDER = ['housing', 'time', 'experience', 'allergy', 'budget', 'temperament', 'shedding', 'clinginess']

function handFits(pet, a) {
  const fits = {
    housing: needFit(a.housing, clamp(pet.spaceNeed)),
    time: needFit(a.time, clamp(pet.companionshipNeed)),
    experience: needFit(a.experience, clamp(pet.difficulty)),
    budget: needFit(a.budget, clamp(pet.costTier)),
    temperament: (preferenceFit(a.temperament, clamp(pet.noise)) + preferenceFit(a.temperament, clamp(pet.activity))) / 2,
    shedding: preferenceFit(a.shedding, clamp(pet.shedding)),
    clinginess: preferenceFit(a.clinginess, clamp(pet.clinginess)),
  }
  if (a.allergy !== undefined) fits.allergy = clamp(pet.allergyFriendly)
  return fits
}

const TIME_REASON = '你每天能陪的时间，够它用的。'

const GROUPS = {
  'A 小空间低预算': {
    answers: { housing: 'dorm', time: '1-2h', experience: 'none', allergy: 'none', budget: 'lt-100', temperament: 'lean-quiet', shedding: 'some-hair', clinginess: 'moderate' },
    expect: {
      hamster: [5, 5, 5, null, 5, 4, 4, 3, 51, 93],
      gecko: [5, 5, 5, null, 5, 4, 3, 3, 50, 91],
      goldfish: [5, 5, 4, null, 5, 4, 3, 3, 49, 89],
      turtle: [4, 5, 5, null, 5, 4, 3, 3, 48, 87],
      hedgehog: [5, 5, 3, null, 4, 4, 3, 4, 47, 85],
      'guinea-pig': [3, 4, 4, null, 4, 4, 5, 5, 44, 80],
      chinchilla: [3, 5, 2, null, 3, 4, 5, 5, 43, 78],
      cat: [3, 5, 4, null, 2, 4.5, 4, 5, 42.5, 77],
      rabbit: [3, 4, 3, null, 4, 4, 5, 4, 42, 76],
      parrot: [3, 3, 3, null, 3, 3, 3, 4, 34, 62],
      ferret: [2, 2, 1, null, 2, 3, 5, 4, 27, 49],
      dog: [2, 2, 3, null, 1, 3, 4, 3, 25, 45],
    },
    top3: [
      { petId: 'hamster', percent: 93 },
      { petId: 'gecko', percent: 91 },
      { petId: 'goldfish', percent: 89 },
    ],
  },
  'B 时间充足': {
    answers: { housing: 'two-bed', time: 'gt-4h', experience: 'some', allergy: 'none', budget: 'lt-400', temperament: 'lean-active', shedding: 'any-hair', clinginess: 'very-clingy' },
    expect: {
      'guinea-pig': [5, 5, 5, null, 5, 4, 3, 3, 50, 91],
      dog: [5, 5, 5, null, 3, 4, 4, 5, 49, 89],
      parrot: [5, 5, 5, null, 5, 4, 1, 4, 49, 89],
      rabbit: [5, 5, 5, null, 5, 3, 3, 2, 48, 87],
      chinchilla: [5, 5, 4, null, 5, 3, 3, 3, 48, 87],
      cat: [5, 5, 5, null, 4, 2.5, 4, 3, 47.5, 86],
      hamster: [5, 5, 5, null, 5, 3, 2, 1, 46, 84],
      hedgehog: [5, 5, 5, null, 5, 3, 1, 2, 46, 84],
      ferret: [5, 5, 3, null, 4, 3, 3, 4, 46, 84],
      turtle: [5, 5, 5, null, 5, 2, 1, 1, 44, 80],
      goldfish: [5, 5, 5, null, 5, 2, 1, 1, 44, 80],
      gecko: [5, 5, 5, null, 5, 2, 1, 1, 44, 80],
    },
    top3: [
      { petId: 'guinea-pig', percent: 91 },
      { petId: 'dog', percent: 89 },
      { petId: 'parrot', percent: 89 },
    ],
  },
  'C 有过敏顾虑': {
    answers: { housing: 'one-bed', time: '2-4h', experience: 'some', allergy: 'confirmed', budget: 'lt-200', temperament: 'lean-quiet', shedding: 'no-hair', clinginess: 'moderate' },
    expect: {
      turtle: [5, 5, 5, 5, 5, 4, 5, 3, 67, 96],
      goldfish: [5, 5, 5, 5, 5, 4, 5, 3, 67, 96],
      gecko: [5, 5, 5, 5, 5, 4, 5, 3, 67, 96],
      hedgehog: [5, 5, 5, 4, 5, 4, 5, 4, 65, 93],
      hamster: [5, 5, 5, 4, 5, 4, 4, 3, 63, 90],
      rabbit: [4, 5, 5, 3, 5, 4, 3, 4, 58, 83],
      chinchilla: [4, 5, 4, 3, 4, 4, 3, 5, 56, 80],
      'guinea-pig': [4, 5, 5, 2, 5, 4, 3, 5, 56, 80],
      parrot: [4, 4, 5, 3, 4, 3, 5, 4, 54, 77],
      cat: [4, 5, 5, 2, 3, 4.5, 2, 5, 51.5, 74],
      ferret: [3, 3, 3, 2, 3, 3, 3, 4, 40, 57],
      dog: [3, 3, 5, 2, 2, 3, 2, 3, 38, 54],
    },
    top3: [
      { petId: 'turtle', percent: 96 },
      { petId: 'goldfish', percent: 96 },
      { petId: 'gecko', percent: 96 },
    ],
  },
}

const pets = listPets()

describe('C 的 11-19 独立预期（docs/03）', () => {
  for (const [groupName, group] of Object.entries(GROUPS)) {
    describe(groupName, () => {
      it('36 格契合分、S 和百分比与手算表一致', () => {
        const scores = toAnswerScores(group.answers)
        const active = ORDER.filter((id) => scores[id] !== undefined)
        const weightTotal = active.reduce((sum, id) => sum + WEIGHTS[id], 0)
        const diffs = []

        for (const [petId, row] of Object.entries(group.expect)) {
          const pet = pets.find((candidate) => candidate.id === petId)
          const fits = handFits(pet, scores)
          const sum = active.reduce((total, id) => total + fits[id] * WEIGHTS[id], 0)
          const percent = Math.round((sum / (5 * weightTotal)) * 100)

          ORDER.forEach((id, column) => {
            const got = id === 'allergy' && scores.allergy === undefined ? null : fits[id]
            if (got !== row[column]) diffs.push(`${petId}.${id}: 手算 ${row[column]} / 实算 ${got}`)
          })
          if (sum !== row[8]) diffs.push(`${petId}.S: 手算 ${row[8]} / 实算 ${sum}`)
          if (percent !== row[9]) diffs.push(`${petId}.百分比: 手算 ${row[9]} / 实算 ${percent}`)
        }

        expect(diffs).toEqual([])
      })

      it('rankPets 的 Top 3 顺序、百分比、理由与手算表一致', () => {
        const scores = toAnswerScores(group.answers)
        expect(Object.keys(scores)).toHaveLength(group.answers.allergy === 'none' ? 7 : 8)

        const top3 = rankPets(scores)
        expect(top3.map(({ petId, percent }) => ({ petId, percent }))).toEqual(group.top3)
        expect(top3.map(({ reason }) => reason)).toEqual(group.top3.map(() => TIME_REASON))
      })
    })
  }

  it('手算表自身自洽：每行格子乘权重等于表内 S', () => {
    const broken = []
    for (const [groupName, group] of Object.entries(GROUPS)) {
      for (const [petId, row] of Object.entries(group.expect)) {
        const sum = ORDER.reduce((total, id, column) => (row[column] === null ? total : total + row[column] * WEIGHTS[id]), 0)
        if (sum !== row[8]) broken.push(`${groupName}/${petId}: 格子合计 ${sum} / 表内 S ${row[8]}`)
      }
    }
    expect(broken).toEqual([])
  })
})