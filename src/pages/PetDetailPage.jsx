import { Link, useParams } from 'react-router-dom'
import BreedButton from '../components/BreedButton.jsx'
import FavoriteButton from '../features/saved/FavoriteButton.jsx'
import { getPetIcon } from '../assets/petIcons.js'
import { getPet } from '../data/catalog.js'
import { rankPets } from '../logic/match.js'
import { readAnswerScores } from '../logic/quizSession.js'

// 架构 §1 的 #/pets/:id：顶部难度、月花费、寿命，下方按 §1 列出的顺序展示其余十项，值全部读 pets.json 原值。
// 收藏挂 C 的 FavoriteButton，用品清单挂到 #/checklist/:id；「试养一下」只在
// 该类型是本轮 Top 1 时出现（缺有效答案或不是 Top 1 都不渲染），入口指向 C 的 TrialPage。
const LEVELS = [
  { key: 'spaceNeed', label: '空间需求' },
  { key: 'companionshipNeed', label: '陪伴需求' },
  { key: 'shedding', label: '掉毛' },
  { key: 'noise', label: '叫声' },
  { key: 'clinginess', label: '粘人' },
  { key: 'activity', label: '运动量' },
  { key: 'allergyFriendly', label: '过敏友好度' },
]

function Level({ value }) {
  if (value === 0) return <span className="text-sm text-ink-soft">0 完全没有</span>

  return (
    <span role="img" aria-label={`${value} / 5`} className="text-sm tracking-wider text-warm-500">
      {'★'.repeat(value)}
      <span className="text-warm-200">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

export default function PetDetailPage() {
  const { id } = useParams()
  const pet = getPet(id)
  const icon = getPetIcon(pet?.id)
  // 试养入口只看本轮真实 Top 1；没有有效答案时 rankPets 返回空数组，按钮不渲染。
  const isTopOne = Boolean(pet) && rankPets(readAnswerScores())[0]?.petId === pet.id

  if (!pet) {
    return (
      <section className="flex flex-col gap-4 pt-6">
        <h2 className="text-xl font-semibold text-ink">没找到这种宠物</h2>
        <p className="text-base leading-relaxed text-ink-soft">
          地址里的类型 <span className="font-semibold text-ink">{id}</span> 不在 12 种里。
        </p>
        <Link
          to="/"
          className="self-start rounded-card bg-warm-500 px-5 py-3 text-base font-semibold text-white active:bg-warm-600"
        >
          回首页
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <img
              src={icon}
              alt=""
              width={200}
              height={200}
              className="h-16 w-16 rounded-full bg-warm-100 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-100 text-2xl font-semibold text-warm-700"
            >
              {pet.name.slice(0, 1)}
            </span>
          )}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-ink">{pet.name}</h2>
            <p className="text-base leading-relaxed text-ink-soft">{pet.personality}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1 rounded-card border border-warm-100 bg-white p-3 shadow-sm">
          <span className="text-sm text-ink-soft">饲养难度</span>
          <Level value={pet.difficulty} />
        </div>
        <div className="flex flex-col gap-1 rounded-card border border-warm-100 bg-white p-3 shadow-sm">
          <span className="text-sm text-ink-soft">月花费</span>
          <span className="text-base font-semibold text-ink">约 {pet.monthlyCost} / 月</span>
        </div>
        <div className="flex flex-col gap-1 rounded-card border border-warm-100 bg-white p-3 shadow-sm">
          <span className="text-sm text-ink-soft">寿命</span>
          <span className="text-base font-semibold text-ink">{pet.lifespan}</span>
        </div>
      </section>

      <section className="flex flex-col gap-1">
        <ul className="flex flex-col">
          {LEVELS.map((level) => (
            <li
              key={level.key}
              className="flex items-center justify-between gap-3 border-b border-warm-100 py-3 last:border-b-0"
            >
              <span className="text-base text-ink">{level.label}</span>
              <Level value={pet[level.key]} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-ink">适合人群</h3>
          <p className="text-base leading-relaxed text-ink-soft">{pet.suitableFor}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-ink">注意事项</h3>
          <p className="text-base leading-relaxed text-ink-soft">{pet.notes}</p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {isTopOne && (
          <Link
            to="/trial"
            className="self-start rounded-full bg-warm-500 px-4 py-2 text-sm font-semibold text-white active:bg-warm-600"
          >
            试养一下
          </Link>
        )}
        <FavoriteButton petId={pet.id} />
        <BreedButton typeId={pet.id} />
        <Link
          to={`/checklist/${pet.id}`}
          className="self-start rounded-full border border-warm-200 bg-white px-4 py-2 text-sm font-medium text-warm-700"
        >
          用品清单
        </Link>
      </div>

      <p className="text-sm leading-relaxed text-ink-soft">
        量表统一 1–5 分：空间、陪伴、运动量、掉毛、叫声、粘人是 5 = 需求或程度最高；过敏友好度 5 =
        最友好；饲养难度 1 = 最好养，5 = 最难养。掉毛和叫声的 0 是「完全没有」，只出现在乌龟、金鱼、守宫。
        月花费和寿命是国内常见估算范围，不是精确报价。
      </p>
    </div>
  )
}
