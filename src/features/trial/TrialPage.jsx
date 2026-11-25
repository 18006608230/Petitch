import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { getPet, getScenarios } from '../../data/catalog.js'
import { rankPets } from '../../logic/match.js'
import { readAnswerScores } from '../../logic/quizSession.js'
import { useMotionTokens } from '../../motion.js'
import {
  TOTAL_SCORE,
  TRIAL_OPTIONS,
  confirmCard,
  deductionBreakdown,
  imageFor,
  scoreOf,
  verdictOf,
} from './trialLogic.js'

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
    const verdict = verdictOf(score)
    const deductions = deductionBreakdown(answers)
    return (
      <motion.section className="flex flex-col gap-5 pt-6" {...m.entrance(8)}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-ink">试养结束</h2>
          <p className="text-base leading-relaxed text-ink-soft">
            你为「{pet.name}」体验了五张照护卡，忍受度按扣分合计得出。
          </p>
        </div>

        <p className="text-5xl font-semibold text-warm-600" aria-label={`忍受度 ${score} 分`}>
          {score}
          <span className="ml-2 text-base font-normal text-ink-soft">/ {TOTAL_SCORE}</span>
        </p>

        <section className="flex flex-col gap-2 rounded-card border border-warm-100 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-ink">
            {verdict === 'discourage' && '结论：劝退'}
            {verdict === 'warn' && '结论：提醒'}
            {verdict === 'suitable' && '结论：适合'}
          </h3>

          {verdict === 'discourage' && (
            <>
              <p className="text-base leading-relaxed text-ink-soft">
                照护它的麻烦超出了你现在的接受范围，别勉强，可以先把决定放一放：
              </p>
              <ul className="list-disc pl-5 text-base leading-relaxed text-ink-soft">
                <li>延后决定：等时间、预算或住处更合适再说</li>
                <li>云养宠：线上助养，或关注收容所的公开动态</li>
                <li>到收容所做志愿者：先积累和动物相处的经验</li>
              </ul>
            </>
          )}

          {verdict === 'warn' && (
            <>
              <p className="text-base leading-relaxed text-ink-soft">
                下面这些你只是勉强接受，先想清楚再决定：
              </p>
              <ul className="flex flex-col gap-2">
                {deductions.map((entry) => (
                  <li
                    key={entry.scenarioId}
                    className="flex items-start justify-between gap-3 border-b border-warm-100 pb-2 text-base leading-relaxed text-ink last:border-b-0 last:pb-0"
                  >
                    <span>{scenarios.find((scenario) => scenario.id === entry.scenarioId)?.text}</span>
                    <span className="shrink-0 text-sm font-medium text-warm-700">−{entry.points} 分</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {verdict === 'suitable' && (
            <>
              <p className="text-base leading-relaxed text-ink-soft">
                这些麻烦你都接得住，可以开始准备用品了。
              </p>
              <Link
                to={`/checklist/${petId}`}
                className="self-start rounded-card bg-warm-500 px-5 py-3 text-base font-semibold text-white active:bg-warm-600"
              >
                查看「{pet.name}」的用品清单
              </Link>
            </>
          )}
        </section>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            to="/guide"
            className="rounded-card border border-warm-200 bg-white px-5 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
          >
            看领养指南
          </Link>
          <button type="button" onClick={restart} className="text-sm text-ink-soft">
            重新试养
          </button>
        </div>
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
          className="mx-auto aspect-square w-full max-w-[192px] rounded-card bg-warm-100 object-cover"
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
