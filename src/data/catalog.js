import petsData from './pets.json'
import scenariosData from './scenarios.json'
import checklistsData from './checklists.json'

// 架构 §4「预算档换算」：取 monthlyCost 区间右端，按 ≤100=1、≤200=2、≤400=3、≤600=4、>600=5 落档。
// 阈值含上限：狗 ¥300–800 取 800 → 5 档，雪貂 ¥300–600 取 600 → 4 档，龙猫 ¥200–400 取 400 → 3 档。
// 原表与 pets.json 只存 monthlyCost 实测区间，派生档只在这里算，避免两处漂移；详情页文案仍读原字符串。
const COST_TIER_MAX = [100, 200, 400, 600]

export function costTierOf(monthlyCost) {
  const amounts = String(monthlyCost).match(/\d+/g)?.map(Number) ?? []
  if (amounts.length === 0) return null
  const rightEnd = Math.max(...amounts)
  const index = COST_TIER_MAX.findIndex((max) => rightEnd <= max)
  return index === -1 ? 5 : index + 1
}

const pets = petsData.pets.map((pet) => ({ ...pet, costTier: costTierOf(pet.monthlyCost) }))

export function listPets() {
  return pets
}

export function getPet(id) {
  return pets.find((pet) => pet.id === id) ?? null
}

export function getScenarios(petId) {
  if (!getPet(petId)) return null
  return scenariosData.byPet[petId] ?? scenariosData.shared
}

export function getChecklist(petId) {
  if (!getPet(petId)) return null
  return checklistsData.byPet[petId] ?? null
}
