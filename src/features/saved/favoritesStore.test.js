import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FAVORITES_KEY, isFavorite, readFavorites, toggleFavorite } from './favoritesStore.js'

// 用内存 Map 模拟 localStorage；每次读取都走存储，等价于关页重开后的状态。
function createStorage() {
  const data = new Map()
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => {
      data.set(key, String(value))
    },
    removeItem: (key) => {
      data.delete(key)
    },
  }
}

let storage

beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal('localStorage', storage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('收藏存储 petitch.favorites.v1', () => {
  it('缺键时回到空状态', () => {
    expect(readFavorites()).toEqual([])
    expect(isFavorite('dog')).toBe(false)
  })

  it('收藏两种、取消一种，重新读取后状态正确', () => {
    toggleFavorite('dog')
    toggleFavorite('cat')
    expect(readFavorites()).toEqual(['dog', 'cat'])
    expect(isFavorite('dog')).toBe(true)

    toggleFavorite('dog')
    expect(readFavorites()).toEqual(['cat'])
    expect(isFavorite('dog')).toBe(false)
    expect(JSON.parse(storage.getItem(FAVORITES_KEY))).toEqual(['cat'])
  })

  it('重复收藏同一类型只保留一份', () => {
    storage.setItem(FAVORITES_KEY, JSON.stringify(['rabbit', 'rabbit']))
    expect(readFavorites()).toEqual(['rabbit'])
    expect(toggleFavorite('rabbit')).toEqual([])
    expect(readFavorites()).toEqual([])
  })

  it('坏 JSON 回到空状态，之后仍能正常写入', () => {
    storage.setItem(FAVORITES_KEY, '{not json')
    expect(readFavorites()).toEqual([])
    expect(toggleFavorite('rabbit')).toEqual(['rabbit'])
    expect(readFavorites()).toEqual(['rabbit'])
  })

  it('存量数据去重并过滤非字符串', () => {
    storage.setItem(FAVORITES_KEY, JSON.stringify(['dog', 'dog', '', 3, null, 'cat']))
    expect(readFavorites()).toEqual(['dog', 'cat'])
  })

  it('存储不可用时读取回空、切换返回 null 不假称成功', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(readFavorites()).toEqual([])
    expect(isFavorite('dog')).toBe(false)
    expect(toggleFavorite('dog')).toBeNull()
  })

  it('写入抛错时返回 null，旧收藏保持不变', () => {
    toggleFavorite('dog')
    vi.stubGlobal('localStorage', {
      getItem: (key) => storage.getItem(key),
      setItem: () => {
        throw new Error('quota exceeded')
      },
      removeItem: () => {},
    })
    expect(toggleFavorite('cat')).toBeNull()
    expect(JSON.parse(storage.getItem(FAVORITES_KEY))).toEqual(['dog'])
  })

  it('非法 petId 不写入', () => {
    expect(toggleFavorite('')).toBeNull()
    expect(toggleFavorite(undefined)).toBeNull()
    expect(readFavorites()).toEqual([])
  })
})
