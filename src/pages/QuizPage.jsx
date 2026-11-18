import { useState } from 'react'
import { questions } from '../data/questions.js'
import { clearAnswers, readAnswers, saveAnswers } from '../logic/quizSession.js'
import ProgressBar from '../components/ProgressBar.jsx'
import ChoiceGroup from '../components/ChoiceGroup.jsx'

export default function QuizPage() {
  const [answers, setAnswers] = useState(readAnswers)
  const [step, setStep] = useState(() => {
    const answered = questions.findIndex((question) => answers[question.id] === undefined)
    return answered === -1 ? questions.length : answered
  })

  function choose(optionId) {
    const question = questions[step]
    // 同一题重复点击只认第一次，避免快速双击跳过下一题。
    if (answers[question.id] === optionId) return

    const next = { ...answers, [question.id]: optionId }
    setAnswers(next)
    saveAnswers(next)
    setStep((current) => Math.min(current + 1, questions.length))
  }

  function retake() {
    clearAnswers()
    setAnswers({})
    setStep(0)
  }

  if (step >= questions.length) {
    return (
      <section className="flex flex-col gap-4 pt-6">
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
      </section>
    )
  }

  const question = questions[step]

  return (
    <section className="flex flex-col gap-5">
      <ProgressBar index={step} total={questions.length} />
      <h2 className="text-xl leading-snug font-semibold text-ink">{question.title}</h2>
      <ChoiceGroup
        options={question.options}
        value={answers[question.id]}
        onSelect={choose}
      />
      <button
        type="button"
        onClick={() => setStep((current) => Math.max(current - 1, 0))}
        disabled={step === 0}
        className="self-start text-sm text-ink-soft disabled:opacity-40"
      >
        返回上一题
      </button>
    </section>
  )
}
