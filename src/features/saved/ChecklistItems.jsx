import { useState } from 'react'
import { motion } from 'motion/react'
import { readCheckedIds, toggleChecklistItem } from './checklistsStore.js'
import { STAGGER, useMotionTokens } from '../../motion.js'

// 架构 §3：收 petId 与 items（getChecklist 的 5–7 项，每项含 id、label），
// 组件自行读写勾选状态，由 A 在 #/checklist/:id 挂载；写入失败保持原勾选并提示。
export default function ChecklistItems({ petId, items }) {
  const [state, setState] = useState(() => ({
    petId,
    checked: readCheckedIds(petId),
    failed: false,
  }))
  const m = useMotionTokens()

  // 换宠物时按新 petId 重读存储（React 官方「props 变化时调整 state」写法，不用 effect）。
  if (state.petId !== petId) {
    setState({ petId, checked: readCheckedIds(petId), failed: false })
  }

  function toggle(itemId) {
    const next = toggleChecklistItem(petId, itemId)
    if (next === null) {
      setState((current) => ({ ...current, failed: true }))
      return
    }
    setState({ petId, checked: next, failed: false })
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col">
        {items.map((item, index) => {
          const checked = state.checked.includes(item.id)
          return (
            <motion.li
              key={item.id}
              className="border-b border-warm-100 last:border-b-0"
              {...m.entrance(6, index * STAGGER)}
            >
              <label className="flex cursor-pointer items-center gap-3 py-3 text-base text-ink">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item.id)}
                  className="h-5 w-5 shrink-0 accent-warm-500"
                />
                <span className={checked ? 'font-medium text-warm-700' : ''}>{item.label}</span>
              </label>
            </motion.li>
          )
        })}
      </ul>
      {state.failed && (
        <span role="status" className="text-xs leading-relaxed text-ink-soft">
          没能保存，请检查浏览器存储设置
        </span>
      )}
    </div>
  )
}
