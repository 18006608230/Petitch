// 六题配置。题序与题干来自架构 §1，选项文案按总方案 §4.3「每题 3–4 个选项」拟稿。
// 待核：选项到 1–5 档的映射原表和架构都未给出，match.js 落地前必须由 B 补齐，本文件只交付 §3 接口表的 id / title / options 形状。
// 本文件按架构 §2 属 B，A 仅为让 npm run dev 跑通而建立。

export const questions = [
  {
    id: 'housing',
    title: '你的住房情况',
    options: [
      { id: 'dorm', label: '宿舍 / 单间' },
      { id: 'one-bed', label: '一居室或合租一间' },
      { id: 'two-bed', label: '两居及以上' },
      { id: 'house', label: '有院子' },
    ],
  },
  {
    id: 'time',
    title: '每天能陪它的时间',
    options: [
      { id: 'lt-1h', label: '1 小时以内' },
      { id: '1-2h', label: '1–2 小时' },
      { id: '2-4h', label: '2–4 小时' },
      { id: 'gt-4h', label: '4 小时以上' },
    ],
  },
  {
    id: 'experience',
    title: '养宠经验',
    options: [
      { id: 'none', label: '完全没养过' },
      { id: 'some', label: '养过一两种，或帮人照顾过' },
      { id: 'rich', label: '养过多年，能处理突发情况' },
    ],
  },
  {
    id: 'allergy',
    title: '过敏顾虑',
    options: [
      { id: 'none', label: '都没有' },
      { id: 'unsure', label: '有点担心，但没确诊过' },
      { id: 'confirmed', label: '已确诊对毛或皮屑过敏' },
    ],
  },
  {
    id: 'budget',
    title: '每月能接受的花费',
    options: [
      { id: 'lt-100', label: '¥100 以内' },
      { id: '100-300', label: '¥100–300' },
      { id: '300-600', label: '¥300–600' },
      { id: 'gt-600', label: '¥600 以上' },
    ],
  },
  {
    id: 'temperament',
    title: '你喜欢安静还是活泼',
    options: [
      { id: 'very-quiet', label: '越安静越好' },
      { id: 'lean-quiet', label: '偏安静' },
      { id: 'lean-active', label: '偏活泼' },
      { id: 'very-active', label: '热闹点好' },
    ],
  },
]
