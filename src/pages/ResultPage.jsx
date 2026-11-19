import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions.js'
import { clearAnswers, readAnswers } from '../logic/quizSession.js'
import { useMotionTokens } from '../motion.js'

export default function ResultPage() {
  const navigate = useNavigate()
  const m = useMotionTokens()
  const answered = Object.keys(readAnswers()).length
  const remaining = questions.length - answered

  if (remaining > 0) {
    return (
      <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
        <h2 className="text-xl font-semibold text-ink">
          {answered === 0 ? '还没有完成问卷' : `问卷还差 ${remaining} 题没答完`}
        </h2>
        <p className="text-base leading-relaxed text-ink-soft">
          结果按你在这一 {questions.length} 题里的选择来排，答完才有依据。
        </p>
        <button
          type="button"
          onClick={() => navigate('/quiz')}
          className="w-full rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
        >
          {answered === 0 ? '去做问卷' : '继续做问卷'}
        </button>
      </motion.section>
    )
  }

  function retake() {
    clearAnswers()
    navigate('/quiz')
  }

  return (
    <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
      <h2 className="text-xl font-semibold text-ink">适合你的类型</h2>
      <p className="text-base leading-relaxed text-ink-soft">
        {questions.length} 题答完了。排名还没接上，接上之前这里不放推测出来的结果。
      </p>
      {/* Top 3 的位置：rankPets 到位后按返回顺序渲染三张卡，名称、百分比、单句理由都取返回值。 */}
      <ol id="top3" className="flex flex-col gap-3" aria-label="最合适的三种类型" />
      <button
        type="button"
        onClick={retake}
        className="self-start rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
      >
        重新测一次
      </button>
    </motion.section>
  )
}
