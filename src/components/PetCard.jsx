import { getPetIcon } from '../assets/petIcons.js'

export default function PetCard({ pet, onOpen }) {
  const icon = getPetIcon(pet.id)

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
        <span className="ml-1 font-medium text-warm-600">{pet.difficulty}/5</span>
      </span>
    </>
  )

  const shell = 'flex w-full flex-col gap-2 rounded-card border border-warm-100 bg-white p-4 text-left shadow-sm'

  // 详情页 11/21 才落地，没有回调时只作展示，避免点进去是死链接。
  if (!onOpen) {
    return <article className={shell}>{body}</article>
  }

  return (
    <button type="button" onClick={() => onOpen(pet.id)} className={shell}>
      {body}
    </button>
  )
}
