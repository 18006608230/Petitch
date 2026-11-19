import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { questions } from '../data/questions.js'
import { clearAnswers, readAnswers, saveAnswers } from '../logic/quizSession.js'
import ProgressBar from '../components/ProgressBar.jsx'
import ChoiceGroup from '../components/ChoiceGroup.jsx'
import { useMotionTokens } from '../motion.js'

// 两次推进之间至少要隔这么久：快速双击的第二个 click 会落在下一题同位置的按钮上，
// 不拦住就会答完一题、跳过下一题。返回上一题时清零，所以退回重选不受影响。
const ADVANCE_COOLDOWN = 400

export default function QuizPage() {
  const m = useMotionTokens()
  const [answers, setAnswers] = useState(readAnswers)
  const [step, setStep] = useState(() => {
    const answered = questions.findIndex((question) => answers[question.id] === undefined)
    return answered === -1 ? questions.length : answered
  })
  const lastAdvanceAt = useRef(0)

  function choose(optionId) {
    const question = questions[step]
    const now = Date.now()
    if (now - lastAdvanceAt.current < ADVANCE_COOLDOWN) return

    // 退回后重新点已选中的那一项，答案不变但仍要推进到下一题。
    if (answers[question.id] !== optionId) {
      const next = { ...answers, [question.id]: optionId }
      setAnswers(next)
      saveAnswers(next)
    }
    lastAdvanceAt.current = now
    setStep((current) => Math.min(current + 1, questions.length))
  }

  function goBack() {
    lastAdvanceAt.current = 0
    setStep((current) => Math.max(current - 1, 0))
  }

  function retake() {
    lastAdvanceAt.current = 0
    clearAnswers()
    setAnswers({})
    setStep(0)
  }

  if (step >= questions.length) {
    return (
      <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
        <h2 className="text-xl font-semibold text-ink">{questions.length} 题答完了</h2>
        <p className="text-base leading-relaxed text-ink-soft">
          匹配结果页由 rankPets 提供，接入后这里直接展示 Top 3。
        </p>
        <button
          type="button"
          onClick={retake}
          className="w-full rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700"
        >
          重新测一次
        </button>
      </motion.section>
    )
  }

  const question = questions[step]

  return (
    <section className="flex flex-col gap-5">
      {/* 进度条留在 keyed 元素外面，重挂载会让它从零开始，弹簧推进就断了。 */}
      <ProgressBar index={step} total={questions.length} />
      <motion.div key={step} className="flex flex-col gap-5" {...m.entrance(8)}>
        <h2 className="text-xl leading-snug font-semibold text-ink">{question.title}</h2>
        <ChoiceGroup
          options={question.options}
          value={answers[question.id]}
          onSelect={choose}
        />
      </motion.div>
      <button
        type="button"
        onClick={goBack}
        disabled={step === 0}
        className="self-start text-sm text-ink-soft disabled:opacity-40"
      >
        返回上一题
      </button>
    </section>
  )
}
