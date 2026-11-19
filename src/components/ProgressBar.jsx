import { motion } from 'motion/react'
import { useMotionTokens } from '../motion.js'

export default function ProgressBar({ index, total }) {
  const m = useMotionTokens()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink-soft">
        第 {index + 1} / {total} 题
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-warm-100"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`答题进度，第 ${index + 1} 题，共 ${total} 题`}
      >
        {/* 条体始终是满宽，进度靠 scaleX 推，不用 transition-all 动 width。 */}
        <motion.div
          className="h-full w-full origin-left rounded-full bg-warm-500"
          {...m.progress((index + 1) / total)}
        />
      </div>
    </div>
  )
}
