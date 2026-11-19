import { useNavigate } from 'react-router-dom'
import PetCard from '../components/PetCard.jsx'
import { getPet } from '../data/catalog.js'
import homeHero from '../assets/home-hero.jpg'

// 架构 §1 只要求首页固定三种，未指定哪三种；本次取狗、猫、兔，覆盖时间充裕、上班族、想安静不出门三类人。
// 卡片只展示不跳转：详情页 11/21 才落地，届时把 onOpen 传进 PetCard 即可，现在不注册路由避免死链接。
const FEATURED_IDS = ['dog', 'cat', 'rabbit']

export default function HomePage() {
  const navigate = useNavigate()
  const featured = FEATURED_IDS.map(getPet).filter(Boolean)

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-4 pt-2">
        <img
          src={homeHero}
          width={400}
          height={400}
          alt="一只猫和一只狗并排趴在边缘上，上方一颗橙色爱心"
          className="h-36 w-36 rounded-[25%] object-cover"
        />
        <h1 className="text-2xl leading-snug font-semibold text-ink">
          先找到适合你的宠物类型，
          <br />
          再决定要不要领养
        </h1>
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
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">热门类型</h2>
        <div className="grid grid-cols-1 gap-3">
          {featured.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      <p className="text-sm text-ink-soft">共 12 种宠物类型 · 问卷约 1 分钟</p>
    </div>
  )
}
