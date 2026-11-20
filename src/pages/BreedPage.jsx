import { motion } from 'motion/react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getPet } from '../data/catalog.js'
import { listBreeds } from '../logic/breedCatalog.js'
import { rankBreeds } from '../logic/match.js'
import { readAnswers, toAnswerScores } from '../logic/quizSession.js'
import { STAGGER, useMotionTokens } from '../motion.js'

export default function BreedPage() {
  const { typeId } = useParams()
  const navigate = useNavigate()
  const m = useMotionTokens()
  const pet = getPet(typeId)
  const ranked = pet ? rankBreeds(typeId, toAnswerScores(readAnswers())) : []

  // 架构 §1：该类型没有品种数据、或这一轮答案无效时，不进入此页。
  if (ranked.length === 0) return <Navigate to="/results" replace />

  const byId = new Map(listBreeds(typeId).map((breed) => [breed.id, breed]))

  return (
    <motion.section className="flex flex-col gap-4 pt-6" {...m.entrance(8)}>
      <h2 className="text-xl font-semibold text-ink">{pet.name}的品种</h2>
      <p className="text-base leading-relaxed text-ink-soft">
        按你这一轮的答案排序，百分比是匹配度。
      </p>
      <ol className="flex flex-col gap-3" aria-label={`${pet.name}的品种排行`}>
        {ranked.map((item, index) => {
          const breed = byId.get(item.breedId)
          return (
            <motion.li
              key={item.breedId}
              className="flex flex-col gap-1 rounded-card border border-warm-100 bg-white p-4 shadow-sm"
              {...m.entrance(12, index * STAGGER)}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-lg font-semibold text-ink">{breed.name}</span>
                <span
                  aria-label={`匹配度 ${item.percent}%`}
                  className="shrink-0 text-lg font-semibold text-warm-600"
                >
                  {item.percent}%
                </span>
              </span>
              <span className="text-sm leading-relaxed text-ink-soft">{item.reason}</span>
              <span className="text-sm leading-relaxed text-ink-soft">特点：{item.feature}</span>
            </motion.li>
          )
        })}
      </ol>
      <button
        type="button"
        onClick={() => navigate('/results')}
        className="self-start rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
      >
        返回结果
      </button>
    </motion.section>
  )
}