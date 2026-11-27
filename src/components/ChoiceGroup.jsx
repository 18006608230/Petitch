import { motion } from 'motion/react'
import { useMotionTokens } from '../motion.js'

export default function ChoiceGroup({ options, value, onSelect }) {
  const m = useMotionTokens()

  return (
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <motion.button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(option.id)}
            className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-card border-2 bg-white px-5 py-4 text-left text-base leading-relaxed active:bg-warm-50 ${
              selected
                ? 'border-warm-500 font-semibold text-warm-700'
                : 'border-warm-200 text-ink'
            }`}
            {...m.press()}
          >
            {/* 选中底色走 opacity，不动 background-color，也不动几何。 */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-warm-100"
              {...m.selectFade(selected)}
            />
            <span className="relative">{option.label}</span>
            {selected && (
              <motion.span className="relative" aria-hidden="true" {...m.pop()}>
                ✓ 已选
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
