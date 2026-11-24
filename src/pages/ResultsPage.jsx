import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import MatchCard from '../components/MatchCard.jsx'
import { getPet } from '../data/catalog.js'
import { questions } from '../data/questions.js'
import { rankPets } from '../logic/match.js'
import { clearAnswers, readAnswers, toAnswerScores } from '../logic/quizSession.js'
import { useMotionTokens } from '../motion.js'

export default function ResultsPage() {
  const navigate = useNavigate()
  const m = useMotionTokens()
  const answers = readAnswers()
  const answered = Object.keys(answers).length
  const remaining = questions.length - answered
  // 答案不全或存的是旧格式时 rankPets 返回空数组：这里只展示空态，不放任何推测结果。
  const top3 = remaining > 0 ? [] : rankPets(toAnswerScores(answers))

  function retake() {
    clearAnswers()
    navigate('/quiz')
  }

  if (top3.length === 0) {
    const headline =
      answered === 0 ? '还没有完成问卷' : remaining > 0 ? `问卷还差 ${remaining} 题没答完` : '这轮答案算不出结果'
    const hint =
      remaining > 0
        ? `结果按你在这一 ${questions.length} 题里的选择来排，答完才有依据。`
        : '存下来的答案对不上这版题目，重新测一次就好。'

    return (
      <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
        <h2 className="text-xl font-semibold text-ink">{headline}</h2>
        <p className="text-base leading-relaxed text-ink-soft">{hint}</p>
        <button
          type="button"
          onClick={remaining > 0 ? () => navigate('/quiz') : retake}
          className="w-full rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
        >
          {answered === 0 ? '去做问卷' : remaining > 0 ? '继续做问卷' : '重新测一次'}
        </button>
      </motion.section>
    )
  }

  return (
    <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
      <h2 className="text-xl font-semibold text-ink">适合你的类型</h2>
      <p className="text-base leading-relaxed text-ink-soft">
        {questions.length} 题答完了，按你的选择排出前三种。百分比是匹配度。
      </p>
      <ol id="top3" className="flex flex-col gap-3" aria-label="最合适的三种类型">
        {top3.map((match, index) => (
          <MatchCard
            key={match.petId}
            pet={getPet(match.petId)}
            percent={match.percent}
            reason={match.reason}
            rank={index + 1}
            index={index}
            showTrial={index === 0}
          />
        ))}
      </ol>
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