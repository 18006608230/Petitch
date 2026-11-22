import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CHECKLISTS_KEY,
  isChecked,
  readCheckedIds,
  readChecklists,
  toggleChecklistItem,
} from './checklistsStore.js'

// 内存 Map 模拟 localStorage；每次读取都走存储，等价于关页重开后的状态。
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

describe('清单存储 petitch.checklists.v1', () => {
  it('缺键时回到空状态', () => {
    expect(readChecklists()).toEqual({})
    expect(readCheckedIds('cat')).toEqual([])
    expect(isChecked('cat', 'cl-cat-1')).toBe(false)
  })

  it('猫勾两项、兔子勾一项，回读各自独立且正确', () => {
    toggleChecklistItem('cat', 'cl-cat-1')
    toggleChecklistItem('cat', 'cl-cat-2')
    toggleChecklistItem('rabbit', 'cl-rabbit-1')

    expect(readCheckedIds('cat')).toEqual(['cl-cat-1', 'cl-cat-2'])
    expect(readCheckedIds('rabbit')).toEqual(['cl-rabbit-1'])
    expect(isChecked('cat', 'cl-cat-2')).toBe(true)
    expect(isChecked('rabbit', 'cl-rabbit-2')).toBe(false)
  })

  it('取消勾选只移除该项，其他项保留', () => {
    toggleChecklistItem('cat', 'cl-cat-1')
    toggleChecklistItem('cat', 'cl-cat-2')
    expect(toggleChecklistItem('cat', 'cl-cat-1')).toEqual(['cl-cat-2'])
    expect(readCheckedIds('cat')).toEqual(['cl-cat-2'])
  })

  it('更新一只宠物不会丢其他类型的记录', () => {
    toggleChecklistItem('cat', 'cl-cat-1')
    toggleChecklistItem('dog', 'cl-dog-1')
    toggleChecklistItem('cat', 'cl-cat-3')
    expect(readChecklists()).toEqual({
      cat: ['cl-cat-1', 'cl-cat-3'],
      dog: ['cl-dog-1'],
    })
  })

  it('坏 JSON 回到空状态，之后仍能正常写入', () => {
    storage.setItem(CHECKLISTS_KEY, '{not json')
    expect(readChecklists()).toEqual({})
    expect(toggleChecklistItem('cat', 'cl-cat-1')).toEqual(['cl-cat-1'])
    expect(readCheckedIds('cat')).toEqual(['cl-cat-1'])
  })

  it('清洗非对象、非数组、重复和非字符串的存量数据', () => {
    storage.setItem(CHECKLISTS_KEY, JSON.stringify({
      cat: ['cl-cat-1', 'cl-cat-1', '', 5, null, 'cl-cat-2'],
      dog: 'cl-dog-1',
      rabbit: null,
    }))
    expect(readChecklists()).toEqual({ cat: ['cl-cat-1', 'cl-cat-2'] })
    expect(readCheckedIds('dog')).toEqual([])
  })

  it('非对象整体回空状态', () => {
    storage.setItem(CHECKLISTS_KEY, JSON.stringify(['cl-cat-1']))
    expect(readChecklists()).toEqual({})
    storage.setItem(CHECKLISTS_KEY, JSON.stringify('cl-cat-1'))
    expect(readChecklists()).toEqual({})
  })

  it('存储不可用或写入失败时返回 null，旧记录保持不变', () => {
    toggleChecklistItem('cat', 'cl-cat-1')
    vi.stubGlobal('localStorage', {
      getItem: (key) => storage.getItem(key),
      setItem: () => {
        throw new Error('quota exceeded')
      },
      removeItem: () => {},
    })
    expect(toggleChecklistItem('cat', 'cl-cat-2')).toBeNull()
    expect(JSON.parse(storage.getItem(CHECKLISTS_KEY))).toEqual({ cat: ['cl-cat-1'] })

    vi.stubGlobal('localStorage', undefined)
    expect(readChecklists()).toEqual({})
    expect(toggleChecklistItem('cat', 'cl-cat-1')).toBeNull()
  })

  it('非法 petId 或 itemId 不写入', () => {
    expect(toggleChecklistItem('', 'cl-cat-1')).toBeNull()
    expect(toggleChecklistItem('cat', '')).toBeNull()
    expect(toggleChecklistItem(undefined, 'cl-cat-1')).toBeNull()
    expect(readChecklists()).toEqual({})
  })
})
