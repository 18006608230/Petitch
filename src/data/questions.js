// 八题配置。题序与题干来自架构 §1，选项沿用 2026-11-18 定版的现行文案（3–4 个/题），
// 不改用户可见文案；2026-11-19 提的扩档方案未经队内定版，未并入。
// 档位（score）按 docs/02-问卷选项与档位对照表.md 填：1 是最低档/最弱偏好，5 是最高档/最强偏好，
// 选项数量不足五档时按语义取档，档位之间可以跳号（如 1、2、4、5）。
// 过敏题沿用架构 §4 的 score: null 跳过判据：选「都没有」时 toAnswerScores 不把 allergy 键放进字典，
// rankPets 按整题跳过、分母扣掉权重 3。其余有顾虑的选项 score 只作非空标记，不参与计分，
// 契合分直接取宠物过敏友好度。
// 本文件按架构 §2 属 B；改选项文案时同步对照表文档。

export const questions = [
  {
    id: 'housing',
    title: '你的住房情况',
    options: [
      { id: 'dorm', label: '宿舍 / 单间', score: 1 },
      { id: 'one-bed', label: '一居室或合租一间', score: 2 },
      { id: 'two-bed', label: '两居及以上', score: 4 },
      { id: 'house', label: '有院子', score: 5 },
    ],
  },
  {
    id: 'time',
    title: '每天能陪它的时间',
    options: [
      { id: 'lt-1h', label: '1 小时以内', score: 1 },
      { id: '1-2h', label: '1–2 小时', score: 2 },
      { id: '2-4h', label: '2–4 小时', score: 3 },
      { id: 'gt-4h', label: '4 小时以上', score: 5 },
    ],
  },
  {
    id: 'experience',
    title: '养宠经验',
    options: [
      { id: 'none', label: '完全没养过', score: 1 },
      { id: 'some', label: '养过一两种，或帮人照顾过', score: 3 },
      { id: 'rich', label: '养过多年，能处理突发情况', score: 5 },
    ],
  },
  {
    id: 'allergy',
    title: '过敏顾虑',
    // 架构 §4 的跳过判据：score 为 null 的选项不进字典，rankPets 见不到 allergy 键就跳过分母扣 3。
    // 两个「有顾虑」选项的 score 只要求非空，值不参与计分，契合分取宠物的过敏友好度。
    options: [
      { id: 'none', label: '都没有', score: null },
      { id: 'unsure', label: '有点担心，但没确诊过', score: 3 },
      { id: 'confirmed', label: '已确诊对毛或皮屑过敏', score: 2 },
    ],
  },
  {
    id: 'budget',
    title: '每月能接受的花费',
    // 五档按左开右闭理解：「以内」含上限，与 catalog 的 costTier 阈值一一对齐。
    options: [
      { id: 'lt-100', label: '¥100 以内', score: 1 },
      { id: 'lt-200', label: '¥200 以内', score: 2 },
      { id: 'lt-400', label: '¥400 以内', score: 3 },
      { id: 'lt-600', label: '¥600 以内', score: 4 },
      { id: 'gt-600', label: '¥600 以上', score: 5 },
    ],
  },
  {
    id: 'temperament',
    title: '你喜欢安静还是活泼',
    options: [
      { id: 'very-quiet', label: '越安静越好', score: 1 },
      { id: 'lean-quiet', label: '偏安静', score: 2 },
      { id: 'lean-active', label: '偏活泼', score: 4 },
      { id: 'very-active', label: '热闹点好', score: 5 },
    ],
  },
  {
    id: 'shedding',
    title: '你能接受家里到处是毛吗',
    options: [
      { id: 'no-hair', label: '一点毛都不能有', score: 1 },
      { id: 'some-hair', label: '有点毛能接受，别太多', score: 3 },
      { id: 'any-hair', label: '掉毛无所谓', score: 5 },
    ],
  },
  {
    id: 'clinginess',
    title: '你希望宠物多粘人',
    options: [
      { id: 'independent', label: '独立一点好，别总粘着我', score: 1 },
      { id: 'moderate', label: '适中，偶尔粘一下', score: 3 },
      { id: 'very-clingy', label: '越粘人越好', score: 5 },
    ],
  },
]
