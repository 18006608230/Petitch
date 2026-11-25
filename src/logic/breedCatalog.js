import { costTierOf } from '../data/catalog.js'

// breeds.json 按架构 §2 属 B，分三批到货：2026-11-20 狗/猫/兔/鹦鹉 24 个，11-21 龟/仓鼠/守宫 9 个，11-24 金鱼/龙猫/荷兰猪/雪貂 12 个。
// 用 glob 读：文件不存在时得到空对象，所有类型都判为「无品种数据」，入口不渲染，构建也不报错。
// 花费档与 pets 同口径，只在读取层派生一次（架构 §4），页面仍显示 monthlyCost 原文。
const modules = import.meta.glob('../data/breeds.json', { eager: true, import: 'default' })
const breeds = (modules['../data/breeds.json']?.breeds ?? []).map((breed) => ({
  ...breed,
  costTier: costTierOf(breed.monthlyCost),
}))

export function listBreeds(typeId) {
  return breeds.filter((breed) => breed.typeId === typeId)
}

export function hasBreeds(typeId) {
  return listBreeds(typeId).length > 0
}