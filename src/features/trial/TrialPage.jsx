import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { getPet, getScenarios } from '../../data/catalog.js'
import { rankPets } from '../../logic/match.js'
import { readAnswerScores } from '../../logic/quizSession.js'
import { useMotionTokens } from '../../motion.js'
import { TOTAL_SCORE, TRIAL_OPTIONS, confirmCard, imageFor, scoreOf } from './trialLogic.js'

// 架构 §3：本轮 Top 1 只能由真实答案派生，不接受 URL 参数指定其他类型；缺有效答案回问卷。
export default function TrialPage() {
  const [top] = rankPets(readAnswerScores())
  if (!top) return <Navigate to="/quiz" replace />
  return <TrialRun key={top.petId} petId={top.petId} />
}

function TrialRun({ petId }) {
  const m = useMotionTokens()
  const pet = getPet(petId)
  const scenarios = getScenarios(petId)
  // 只存在组件内存：刷新试养页从本轮 Top 1 的第一张重新开始（架构 §5）。
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const index = Object.keys(answers).length
  const scenario = scenarios[index]
  const done = index >= scenarios.length
  const score = scoreOf(answers)

  function confirm() {
    if (!scenario || selected === null) return
    setAnswers(confirmCard(answers, scenario.id, selected))
    setSelected(null)
  }

  function restart() {
    setAnswers({})
    setSelected(null)
  }

  if (done) {
    return (
      <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
        <h2 className="text-xl font-semibold text-ink">试养结束</h2>
        <p className="text-base leading-relaxed text-ink-soft">
          你为「{pet.name}」体验了五张照护卡，忍受度按扣分合计得出。
        </p>
        <p className="text-5xl font-semibold text-warm-600" aria-label={`忍受度 ${score} 分`}>
          {score}
          <span className="ml-2 text-base font-normal text-ink-soft">/ {TOTAL_SCORE}</span>
        </p>
        <button
          type="button"
          onClick={restart}
          className="self-start rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
        >
          重新试养
        </button>
      </motion.section>
    )
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink-soft">
          试养「{pet.name}」· 第 {index + 1} / {scenarios.length} 张
        </p>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-warm-100"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={scenarios.length}
          aria-label={`试养进度，第 ${index + 1} 张，共 ${scenarios.length} 张`}
        >
          <motion.div
            className="h-full w-full origin-left rounded-full bg-warm-500"
            animate={{ scaleX: (index + 1) / scenarios.length }}
            transition={{ type: 'spring', stiffness: 210, damping: 26 }}
          />
        </div>
      </div>

      <motion.div key={scenario.id} className="flex flex-col gap-4" {...m.entrance(8)}>
        <img
          src={imageFor(petId, index)}
          alt=""
          width={800}
          height={800}
          className="h-44 w-full rounded-card bg-warm-100 object-cover"
        />
        <h2 className="text-xl leading-snug font-semibold text-ink">{scenario.text}</h2>

        <div className="flex flex-col gap-2" role="radiogroup" aria-label="这一张你能接受吗">
          {TRIAL_OPTIONS.map((option) => {
            const active = selected === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(option.id)}
                className={`rounded-card border-2 bg-white px-5 py-3 text-left text-base leading-relaxed active:bg-warm-50 ${
                  active
                    ? 'border-warm-500 font-semibold text-warm-700'
                    : 'border-warm-200 text-ink'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={confirm}
          disabled={selected === null}
          className="w-full rounded-card bg-warm-500 px-6 py-3 text-base font-semibold text-white active:bg-warm-600 disabled:opacity-40"
        >
          {index === scenarios.length - 1 ? '确认并查看结果' : '确认，下一张'}
        </button>
      </motion.div>
    </section>
  )
}
