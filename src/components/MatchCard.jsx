import { motion } from 'motion/react'
import BreedButton from './BreedButton.jsx'
import { getPetIcon } from '../assets/petIcons.js'
import { STAGGER, useMotionTokens } from '../motion.js'

export default function MatchCard({ pet, percent, reason, rank, index = 0 }) {
  const m = useMotionTokens()
  const icon = getPetIcon(pet.id)

  return (
    <motion.li
      className="flex items-center gap-3 rounded-card border border-warm-100 bg-white p-4 shadow-sm"
      {...m.entrance(12, index * STAGGER)}
    >
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
        <span className="text-lg font-semibold text-ink">{pet.name}</span>
        <span className="text-sm leading-relaxed text-ink-soft">{reason}</span>
        <BreedButton typeId={pet.id} />
      </span>
      <span
        aria-label={`匹配度 ${percent}%`}
        className="ml-auto shrink-0 text-xl font-semibold text-warm-600"
      >
        {percent}%
      </span>
    </motion.li>
  )
}