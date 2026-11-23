import { describe, expect, it } from 'vitest'
import { getScenarios } from '../../data/catalog.js'
import {
  DEDUCTIONS,
  TOTAL_SCORE,
  confirmCard,
  deductionOf,
  imageFor,
  scoreOf,
} from './trialLogic.js'

describe('试养计分', () => {
  it('三个选项依次扣 0、5、20 分', () => {
    expect(DEDUCTIONS).toEqual({ accept: 0, tolerate: 5, reject: 20 })
    expect(deductionOf('accept')).toBe(0)
    expect(deductionOf('tolerate')).toBe(5)
    expect(deductionOf('reject')).toBe(20)
  })

  it('五次全接受得 100，五次全拒绝得 0', () => {
    const all = (optionId) => ({ 'a-1': optionId, 'a-2': optionId, 'a-3': optionId, 'a-4': optionId, 'a-5': optionId })
    expect(scoreOf(all('accept'))).toBe(TOTAL_SCORE)
    expect(scoreOf(all('reject'))).toBe(0)
    expect(scoreOf(all('tolerate'))).toBe(75)
  })

  it('架构 §5 的四个边界样例：55、60、85、90', () => {
    // 括号内为五张卡的扣分：20,20,5,0,0 / 20,20,0,0,0 / 5,5,5,0,0 / 5,5,0,0,0
    expect(scoreOf({ 1: 'reject', 2: 'reject', 3: 'tolerate', 4: 'accept', 5: 'accept' })).toBe(55)
    expect(scoreOf({ 1: 'reject', 2: 'reject', 3: 'accept', 4: 'accept', 5: 'accept' })).toBe(60)
    expect(scoreOf({ 1: 'tolerate', 2: 'tolerate', 3: 'tolerate', 4: 'accept', 5: 'accept' })).toBe(85)
    expect(scoreOf({ 1: 'tolerate', 2: 'tolerate', 3: 'accept', 4: 'accept', 5: 'accept' })).toBe(90)
  })

  it('没答完时按已答的卡扣分', () => {
    expect(scoreOf({})).toBe(100)
    expect(scoreOf({ 1: 'reject' })).toBe(80)
  })
})

describe('按卡标识确认', () => {
  it('同一张卡重复确认只算第一次，不覆盖', () => {
    const once = confirmCard({}, 'dog-1', 'tolerate')
    expect(once).toEqual({ 'dog-1': 'tolerate' })
    expect(confirmCard(once, 'dog-1', 'reject')).toEqual({ 'dog-1': 'tolerate' })
    expect(scoreOf(confirmCard(once, 'dog-1', 'reject'))).toBe(95)
  })

  it('五张卡逐张确认后结算，连点末卡只算一次', () => {
    const scenarios = getScenarios('dog')
    let answers = {}
    for (const scenario of scenarios) {
      answers = confirmCard(answers, scenario.id, 'accept')
    }
    expect(Object.keys(answers)).toHaveLength(5)
    expect(scoreOf(answers)).toBe(100)

    // 末卡快速连点：第二次确认同一张卡不应改变答案或分数。
    const last = scenarios[scenarios.length - 1]
    const again = confirmCard(answers, last.id, 'reject')
    expect(again).toEqual(answers)
    expect(scoreOf(again)).toBe(100)
  })
})

describe('卡片素材', () => {
  it('狗/猫/兔/仓鼠/鹦鹉用专属图，其余七种用通用图', () => {
    expect(imageFor('dog', 0)).toBe('/images/trial/trial-dog-1.webp')
    expect(imageFor('parrot', 4)).toBe('/images/trial/trial-parrot-5.webp')
    expect(imageFor('turtle', 0)).toBe('/images/trial/trial-generic-1.webp')
    expect(imageFor('gecko', 2)).toBe('/images/trial/trial-generic-3.webp')
  })

  it('专属与通用卡各五张，库存 30 张', () => {
    const own = ['dog', 'cat', 'rabbit', 'hamster', 'parrot']
    for (const petId of own) expect(getScenarios(petId)).toHaveLength(5)
    const shared = ['turtle', 'chinchilla', 'hedgehog', 'goldfish', 'gecko', 'guinea-pig', 'ferret']
    for (const petId of shared) {
      const scenarios = getScenarios(petId)
      expect(scenarios).toHaveLength(5)
      expect(scenarios.every((scenario) => scenario.id.startsWith('shared-'))).toBe(true)
    }
    expect(getScenarios('dog').every((scenario) => scenario.id.startsWith('dog-'))).toBe(true)
  })
})
