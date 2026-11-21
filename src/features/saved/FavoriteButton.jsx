import { useState } from 'react'
import { isFavorite, toggleFavorite } from './favoritesStore.js'

// 架构 §3：收 petId，组件自行读写收藏状态，由 A 在详情页和结果页挂载。
// 写入失败时保持原选中态，并提示没保存，不假称已收藏。
export default function FavoriteButton({ petId, className = '' }) {
  const [state, setState] = useState(() => ({ petId, favorite: isFavorite(petId), failed: false }))

  // 换宠物时按新 petId 重读存储（React 官方「props 变化时调整 state」写法，不用 effect）。
  if (state.petId !== petId) {
    setState({ petId, favorite: isFavorite(petId), failed: false })
  }

  function handleClick() {
    const next = toggleFavorite(petId)
    if (next === null) {
      setState((current) => ({ ...current, failed: true }))
      return
    }
    setState({ petId, favorite: next.includes(petId), failed: false })
  }

  return (
    <span className={`inline-flex flex-col items-start gap-1 ${className}`.trim()}>
      <button
        type="button"
        aria-pressed={state.favorite}
        onClick={handleClick}
        className={
          state.favorite
            ? 'inline-flex items-center gap-1.5 rounded-full border border-warm-500 bg-warm-500 px-3.5 py-2 text-sm font-medium text-white active:bg-warm-600'
            : 'inline-flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-3.5 py-2 text-sm text-ink-soft active:bg-warm-50'
        }
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill={state.favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {state.favorite ? '已收藏' : '收藏'}
      </button>
      {state.failed && (
        <span role="status" className="text-xs leading-relaxed text-ink-soft">
          没能保存，请检查浏览器存储设置
        </span>
      )}
    </span>
  )
}
