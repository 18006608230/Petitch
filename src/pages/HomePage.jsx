import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import PetCard from '../components/PetCard.jsx'
import { getPet, listPets } from '../data/catalog.js'
import { useMotionTokens } from '../motion.js'
import homeHero from '../assets/home-hero.jpg'

// 架构 §1 只要求首页固定三种，未指定哪三种；本次取狗、猫、兔，覆盖时间充裕、上班族、想安静不出门三类人。
// 点卡进 #/pets/:id 详情：详情页已落地，故传 onOpen；架构 §1 的「点卡看详情」由此兑现。
const FEATURED_IDS = ['dog', 'cat', 'rabbit']

export default function HomePage() {
  const navigate = useNavigate()
  const m = useMotionTokens()
  const [showAll, setShowAll] = useState(false)
  const featured = FEATURED_IDS.map(getPet).filter(Boolean)
  const rest = listPets().filter((pet) => !FEATURED_IDS.includes(pet.id))
  const open = (id) => navigate(`/pets/${id}`)

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-4 pt-2">
        <div className="flex items-center gap-4">
          <motion.img
            src={homeHero}
            width={400}
            height={400}
            alt="一只猫和一只狗并排趴在边缘上，上方一颗橙色爱心"
            className="h-24 w-24 shrink-0 rounded-[25%] object-cover"
            {...m.entrance(12)}
          />
          <motion.h1
            className="min-w-0 text-lg leading-snug font-semibold text-ink"
            {...m.entrance(12)}
          >
            先找到适合你的宠物类型，
            <br />
            再决定要不要领养
          </motion.h1>
        </div>
        <p className="text-base leading-relaxed text-ink-soft">
          一分钟问卷帮你想清楚该养哪种，试养模拟验证你受不受得了它烦人的那部分。
        </p>
        <button
          type="button"
          onClick={() => navigate('/quiz')}
          className="mt-1 w-full rounded-card bg-warm-500 px-6 py-4 text-lg font-semibold text-white shadow-md active:bg-warm-600"
        >
          开始匹配
        </button>
        <button
          type="button"
          onClick={() => navigate('/guide')}
          className="w-full rounded-card border border-warm-200 bg-white px-6 py-3 text-base font-medium text-warm-700 active:bg-warm-50"
        >
          领养指南
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">热门类型</h2>
        <div className="grid grid-cols-1 gap-3">
          {featured.map((pet, i) => (
            <PetCard key={pet.id} pet={pet} onOpen={open} index={i} />
          ))}
        </div>

        {showAll ? (
          <>
            <div id="all-types" className="grid grid-cols-1 gap-3">
              {rest.map((pet) => (
                <PetCard key={pet.id} pet={pet} onOpen={open} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAll(false)}
              aria-expanded="true"
              aria-controls="all-types"
              className="self-center rounded-full border border-warm-200 bg-white px-5 py-2 text-sm font-medium text-warm-700 active:bg-warm-50"
            >
              收起
            </button>
          </>
        ) : (
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute inset-x-6 top-4 h-full rounded-card border border-warm-100 bg-warm-50 shadow-sm"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-3 top-2 h-full rounded-card border border-warm-100 bg-white shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowAll(true)}
              aria-expanded="false"
              aria-controls="all-types"
              className="relative flex w-full items-center justify-center gap-2 rounded-card border border-warm-200 bg-white px-4 py-3 text-base font-semibold text-warm-700 shadow-sm active:bg-warm-50"
            >
              查看更多
              <span className="text-sm font-normal text-ink-soft">还有 {rest.length} 种</span>
            </button>
          </div>
        )}
      </section>

      <p className="text-sm text-ink-soft">共 {listPets().length} 种宠物类型 · 问卷约 1 分钟</p>
    </div>
  )
}
