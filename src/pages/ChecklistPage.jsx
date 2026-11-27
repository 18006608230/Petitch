import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import ChecklistItems from '../features/saved/ChecklistItems.jsx'
import { getChecklist, getPet } from '../data/catalog.js'
import { useMotionTokens } from '../motion.js'

const MotionLink = motion.create(Link)

// 架构 §1 的 #/checklist/:id：标题显示当前宠物，清单项与勾选状态都由 C 的 ChecklistItems 负责，
// 本页只按 id 取数据并挂组件，不碰存储逻辑。
export default function ChecklistPage() {
  const { id } = useParams()
  const m = useMotionTokens()
  const pet = getPet(id)
  const items = getChecklist(id)

  if (!pet || !items) {
    return (
      <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
        <h2 className="text-xl font-semibold text-ink">没有这份清单</h2>
        <p className="text-base leading-relaxed text-ink-soft">
          地址里的类型 <span className="font-semibold text-ink">{id}</span> 没有对应的用品清单，可能是链接写错了。
        </p>
        <MotionLink
          to="/"
          className="self-start rounded-card bg-warm-500 px-6 py-3 text-base font-semibold text-white active:bg-warm-600"
          {...m.press()}
        >
          回首页
        </MotionLink>
      </motion.section>
    )
  }

  return (
    <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
      <h2 className="text-xl font-semibold text-ink">{pet.name}的用品清单</h2>
      <p className="text-base leading-relaxed text-ink-soft">
        共 {items.length} 项。勾了自动存在这台设备上，换一种宠物各存各的。
      </p>
      <ChecklistItems petId={pet.id} items={items} />
      <MotionLink
        to={`/pets/${pet.id}`}
        className="self-start rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
        {...m.press()}
      >
        返回详情
      </MotionLink>
    </motion.section>
  )
}