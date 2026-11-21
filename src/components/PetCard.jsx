import { useState } from 'react'
import { motion } from 'motion/react'
import { getPetIcon } from '../assets/petIcons.js'
import { STAGGER, useMotionTokens } from '../motion.js'

export default function PetCard({ pet, onOpen, index = 0 }) {
  const icon = getPetIcon(pet.id)
  const m = useMotionTokens()
  const [hovered, setHovered] = useState(false)

  const body = (
    <>
      {icon ? (
        <img
          src={icon}
          alt=""
          width={200}
          height={200}
          className="h-12 w-12 rounded-full bg-warm-100 object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-100 text-xl font-semibold text-warm-700"
        >
          {pet.name.slice(0, 1)}
        </span>
      )}
      <span className="text-lg font-semibold text-ink">{pet.name}</span>
      <span className="text-sm leading-relaxed text-ink-soft">{pet.personality}</span>
      <span className="text-sm text-ink-soft">
        饲养难度
        <span
          role="img"
          aria-label={`${pet.difficulty} / 5`}
          className="ml-1 tracking-wider text-warm-500"
        >
          {'★'.repeat(pet.difficulty)}
          <span className="text-warm-200">{'★'.repeat(5 - pet.difficulty)}</span>
        </span>
      </span>
    </>
  )

  const shell =
    'relative flex w-full flex-col gap-2 rounded-card border border-warm-100 bg-white p-4 text-left shadow-sm'

  // 阴影单独一层做 opacity 淡入，卡片本体只动 transform，这样动画不碰 box-shadow 和几何属性。
  const shadow = (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-card opacity-0 shadow-lg"
      {...m.hoverShadow(hovered)}
    />
  )

  const track = m.reduce
    ? {}
    : { onHoverStart: () => setHovered(true), onHoverEnd: () => setHovered(false) }

  const content = <span className="relative flex flex-col gap-2">{body}</span>

  const entrance = m.entrance(12, index * STAGGER)

  // 没有回调时只作展示，且不挂 whileTap；首页热门卡与展开的九张都传 onOpen，点卡进 #/pets/:id。
  if (!onOpen) {
    return (
      <motion.article className={shell} {...track} {...entrance} {...m.lift()}>
        {shadow}
        {content}
      </motion.article>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(pet.id)}
      className={shell}
      {...track}
      {...entrance}
      {...m.lift()}
      {...m.press()}
    >
      {shadow}
      {content}
    </motion.button>
  )
}
