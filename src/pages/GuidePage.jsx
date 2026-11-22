import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { channels, scams, steps } from '../data/guide.js'
import { STAGGER, useMotionTokens } from '../motion.js'

// 架构 §1 的 #/guide：文案全部来自 B 的 src/data/guide.js，本页只负责渲染，不增删条目、不改字。
export default function GuidePage() {
  const navigate = useNavigate()
  const m = useMotionTokens()

  return (
    <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
      <h2 className="text-xl font-semibold text-ink">领养指南</h2>
      <p className="text-base leading-relaxed text-ink-soft">
        从意向申请到正式接回家，按这四步走；后面是几种常用渠道和要提防的骗局。
      </p>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-ink">四步走</h3>
        <ol className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              className="flex flex-col gap-2 rounded-card border border-warm-100 bg-white p-4 shadow-sm"
              {...m.entrance(12, index * STAGGER)}
            >
              <span className="flex items-baseline gap-2">
                <span aria-hidden="true" className="text-sm font-semibold text-warm-600">
                  {index + 1}
                </span>
                <span className="text-lg font-semibold text-ink">{step.title}</span>
              </span>
              <span className="text-sm leading-relaxed text-ink-soft">{step.summary}</span>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-ink-soft">
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-ink">去哪找</h3>
        <ul className="flex flex-col gap-3">
          {channels.map((channel, index) => (
            <motion.li
              key={channel.id}
              className="flex flex-col gap-2 rounded-card border border-warm-100 bg-white p-4 shadow-sm"
              {...m.entrance(12, index * STAGGER)}
            >
              <span className="text-lg font-semibold text-ink">{channel.name}</span>
              <span className="text-sm leading-relaxed text-ink-soft">{channel.summary}</span>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-ink-soft">
                {channel.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-ink">防骗提醒</h3>
        <ul className="flex flex-col gap-3">
          {scams.map((scam, index) => (
            <motion.li
              key={scam.id}
              className="flex flex-col gap-1 rounded-card border-2 border-warm-300 bg-warm-50 p-4 shadow-sm"
              {...m.entrance(12, index * STAGGER)}
            >
              <span className="text-base font-semibold text-warm-700">{scam.title}</span>
              <span className="text-sm leading-relaxed text-ink-soft">{scam.detail}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="self-start rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
      >
        返回首页
      </button>
    </motion.section>
  )
}