// 架构 §5：收藏存 localStorage 的 petitch.favorites.v1，值是类型标识数组。
// 缺键、坏 JSON、非数组一律回空状态；读到的脏值在读取层去重、过滤非字符串。
export const FAVORITES_KEY = 'petitch.favorites.v1'

function normalize(list) {
  if (!Array.isArray(list)) return []
  const seen = new Set()
  const ids = []
  for (const id of list) {
    if (typeof id !== 'string' || id === '' || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

export function readFavorites() {
  let raw
  try {
    raw = localStorage.getItem(FAVORITES_KEY)
  } catch {
    return []
  }
  if (!raw) return []
  try {
    return normalize(JSON.parse(raw))
  } catch {
    return []
  }
}

export function isFavorite(petId) {
  return readFavorites().includes(petId)
}

// 写入成功返回新的标识数组；存储不可用或写入失败返回 null，调用方不得当成已保存。
export function toggleFavorite(petId) {
  if (typeof petId !== 'string' || petId === '') return null
  const current = readFavorites()
  const next = current.includes(petId)
    ? current.filter((id) => id !== petId)
    : [...current, petId]
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  } catch {
    return null
  }
  return next
}
