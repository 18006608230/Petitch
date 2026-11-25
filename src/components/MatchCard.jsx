import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { getPetIcon } from '../assets/petIcons.js'
import { hasBreeds } from '../logic/breedCatalog.js'
import { STAGGER, useMotionTokens } from '../motion.js'

// 卡片主体是去详情页的 Link；「看看品种」是卡底单独一条 Link，和主体平级，不套链接。
export default function MatchCard({ pet, percent, reason, rank, index = 0, showTrial = false }) {
  const m = useMotionTokens()
  const icon = getPetIcon(pet.id)

  return (
    <motion.li
      className="flex flex-col rounded-card border border-warm-100 bg-white shadow-sm"
      {...m.entrance(12, index * STAGGER)}
    >
      <Link to={`/pets/${pet.id}`} className="group flex items-center gap-3 p-4">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-sm font-semibold text-warm-700"
        >
          {rank}
        </span>
        {icon ? (
          <img
            src={icon}
            alt=""
            width={200}
            height={200}
            className="h-12 w-12 shrink-0 rounded-full bg-warm-100 object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warm-100 text-xl font-semibold text-warm-700"
          >
            {pet.name.slice(0, 1)}
          </span>
        )}
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-lg font-semibold text-ink group-hover:text-warm-700">
            {pet.name}
          </span>
          <span className="text-sm leading-relaxed text-ink-soft">{reason}</span>
        </span>
        <span
          aria-label={`匹配度 ${percent}%`}
          className="ml-auto shrink-0 text-xl font-semibold text-warm-600"
        >
          {percent}%
        </span>
      </Link>
      {(showTrial || hasBreeds(pet.id)) && (
        <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
          {showTrial && (
            <Link
              to={`/trial/${pet.id}`}
              className="inline-block rounded-full bg-warm-500 px-4 py-2 text-sm font-semibold text-white active:bg-warm-600"
            >
              试养一下
            </Link>
          )}
          {hasBreeds(pet.id) && (
            <Link
              to={`/breeds/${pet.id}`}
              className="inline-block rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 active:bg-warm-50"
            >
              看看品种
            </Link>
          )}
        </div>
      )}
    </motion.li>
  )
}