import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { hasBreeds } from '../logic/breedCatalog.js'
import { useMotionTokens } from '../motion.js'

const MotionLink = motion.create(Link)

// 架构 §4 二次匹配：入口是否出现完全由 breeds.json 里有没有该类型的行决定，不写死类型名单。
// 挂载点由 11/20 结果页 Top 3 卡片和 11/21 详情页负责，两处共用本组件。
export default function BreedButton({ typeId }) {
  const m = useMotionTokens()
  if (!hasBreeds(typeId)) return null

  return (
    <MotionLink
      to={`/breeds/${typeId}`}
      className="self-start rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700"
      {...m.press()}
    >
      看看品种
    </MotionLink>
  )
}
