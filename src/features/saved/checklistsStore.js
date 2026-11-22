// 架构 §5：清单存 localStorage 的 petitch.checklists.v1，值是「宠物标识 → 已勾选条目标识数组」。
// 缺键、坏 JSON、非对象一律回空状态；读取时清洗非数组值、去重并过滤非字符串。
export const CHECKLISTS_KEY = 'petitch.checklists.v1'

function normalizeMap(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return {}
  const map = {}
  for (const [petId, ids] of Object.entries(value)) {
    if (!Array.isArray(ids)) continue
    const seen = new Set()
    const clean = []
    for (const id of ids) {
      if (typeof id !== 'string' || id === '' || seen.has(id)) continue
      seen.add(id)
      clean.push(id)
    }
    map[petId] = clean
  }
  return map
}

export function readChecklists() {
  let raw
  try {
    raw = localStorage.getItem(CHECKLISTS_KEY)
  } catch {
    return {}
  }
  if (!raw) return {}
  try {
    return normalizeMap(JSON.parse(raw))
  } catch {
    return {}
  }
}

export function readCheckedIds(petId) {
  return readChecklists()[petId] ?? []
}

export function isChecked(petId, itemId) {
  return readCheckedIds(petId).includes(itemId)
}

// 只动当前宠物，其余类型的勾选原样保留。
// 成功返回该宠物新的勾选数组；存储不可用或写入失败返回 null，调用方不得当成已保存。
export function toggleChecklistItem(petId, itemId) {
  if (typeof petId !== 'string' || petId === '') return null
  if (typeof itemId !== 'string' || itemId === '') return null

  const current = readChecklists()
  const ids = current[petId] ?? []
  const nextIds = ids.includes(itemId)
    ? ids.filter((id) => id !== itemId)
    : [...ids, itemId]
  try {
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify({ ...current, [petId]: nextIds }))
  } catch {
    return null
  }
  return nextIds
}
