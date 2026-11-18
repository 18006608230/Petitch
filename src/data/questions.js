// 八题配置。题序与题干来自架构 §1，选项文案按总方案 §4.3「每题 3–4 个选项」拟稿。
// 待核：原六题选项到 1–5 档的映射由 B 的字段对照表补齐，本文件只在架构已明确给出的地方填 score（掉毛、粘人两题的档位，以及过敏题「都没有」的 null 跳过标记）。
// 预算题按 2026-11-18 定版改成与五档换算规则一一对齐的五个选项，档位仍留给 B 填（band 序号即档值，1–5）。
// 本文件按架构 §2 属 B，A 仅为让 npm run dev 跑通而建立，并按定版追加第七、八题。

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
    // 架构 §4 的跳过判据：score 为 null 的选项不进字典，rankPets 见不到 allergy 键就跳过分母扣 3。
    // 待核：另两个「有顾虑」选项必须填非空 score（值不参与计分，契合分取宠物的过敏友好度），
    // 留空会被当成无顾虑整题跳过——等 B 的对照表时一并给。
    options: [
      { id: 'none', label: '都没有', score: null },
      { id: 'unsure', label: '有点担心，但没确诊过' },
      { id: 'confirmed', label: '已确诊对毛或皮屑过敏' },
    ],
  },
  {
    id: 'budget',
    title: '每月能接受的花费',
    options: [
      { id: 'lt-100', label: '¥100 以内' },
      { id: 'lt-200', label: '¥200 以内' },
      { id: 'lt-400', label: '¥400 以内' },
      { id: 'lt-600', label: '¥600 以内' },
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
