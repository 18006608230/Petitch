import petsData from './pets.json'
import scenariosData from './scenarios.json'
import checklistsData from './checklists.json'

export function listPets() {
  return petsData.pets
}

export function getPet(id) {
  return petsData.pets.find((pet) => pet.id === id) ?? null
}

export function getScenarios(petId) {
  if (!getPet(petId)) return null
  return scenariosData.byPet[petId] ?? scenariosData.shared
}

export function getChecklist(petId) {
  if (!getPet(petId)) return null
  return checklistsData.byPet[petId] ?? null
}
