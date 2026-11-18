// breeds.json 按架构 §2 属 B，本次未落地。用 glob 读：文件不存在时得到空对象，
// 于是所有类型都判为「无品种数据」，入口不渲染，构建也不报错。B 交文件后无需改这里。
// 待核：键名按 pets.json 风格提议为 id / typeId / name，B 给真实样例时若不同名，改本文件的读取即可。
const modules = import.meta.glob('../data/breeds.json', { eager: true, import: 'default' })
const breeds = modules['../data/breeds.json']?.breeds ?? []

export function listBreeds(typeId) {
  return breeds.filter((breed) => breed.typeId === typeId)
}

export function hasBreeds(typeId) {
  return listBreeds(typeId).length > 0
}
