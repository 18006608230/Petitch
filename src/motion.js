import { useReducedMotion } from 'motion/react'

// 全站唯一的动画参数表（2026-11-19 定）。页面和组件只从这里取，不得自带时长或缓动。
// 只允许动 transform 和 opacity：宽度、高度、top、left 一律不进动画。
export const EASE = [0.22, 1, 0.36, 1]

// 默认弹簧：平稳收住，不过冲。ζ = damping / (2√(stiffness × mass)) = 34 / 35.8 ≈ 0.95，
// 对应「默认不弹、阻尼比取到 1.0 附近」这条。
export const SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 1 }

// 交互弹簧：只在有物理感的按压上给一点回弹。ζ = 20 / (2√360) ≈ 0.53。
export const TAP_SPRING = { type: 'spring', stiffness: 360, damping: 20, mass: 1 }

// 热门卡依次出现的间隔。
export const STAGGER = 0.08

const HOVER_MS = 0.3

export function useMotionTokens() {
  const reduce = Boolean(useReducedMotion())

  return {
    reduce,

    // 入场：淡入 + 上移，用缓动曲线，不用弹簧。
    entrance: (offset = 12, delay = 0, duration = 0.5) =>
      reduce
        ? { initial: false }
        : {
            initial: { opacity: 0, y: offset },
            animate: { opacity: 1, y: 0 },
            transition: { duration, ease: EASE, delay },
          },

    // 路由切换：整页淡入 0.4 秒，所有页面共用这一处。
    routeFade: () =>
      reduce
        ? { initial: false }
        : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, ease: EASE } },

    // 卡片悬停抬 4px。阴影是另一层 opacity 淡入，避免动画碰 box-shadow。
    lift: () => (reduce ? {} : { whileHover: { y: -4, transition: { duration: HOVER_MS, ease: EASE } } }),

    // 阴影层不吃指针事件，悬停状态只能由卡片本体传进来，让它自己 whileHover 永远不触发。
    hoverShadow: (hovered) =>
      reduce
        ? { initial: { opacity: 0 }, animate: { opacity: 0 } }
        : {
            initial: false,
            animate: { opacity: hovered ? 1 : 0 },
            transition: { duration: HOVER_MS, ease: EASE },
          },

    // 点按缩到 0.98，松手用弹簧回位。
    press: (scale = 0.98) =>
      reduce ? {} : { whileTap: { scale, transition: TAP_SPRING } },

    // 新出现的勾选标记轻微弹入。
    pop: () =>
      reduce
        ? { initial: false }
        : {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: HOVER_MS, ease: EASE },
          },

    // 收藏图标在状态切换时脉冲一次。
    pulse: (active) =>
      reduce
        ? { initial: false }
        : {
            initial: false,
            animate: { scale: active ? [1, 1.25, 1] : 1 },
            transition: { duration: HOVER_MS, ease: EASE },
          },

    // 悬停图标时轻微歪头并放大。
    iconReact: () =>
      reduce
        ? {}
        : {
            whileHover: { rotate: -4, scale: 1.06 },
            transition: { duration: HOVER_MS, ease: EASE },
          },

    // 选中态的背景层淡入，值变化只走 opacity；减弱动效时直接落到目标透明度。
    selectFade: (selected) =>
      reduce
        ? {
            initial: { opacity: selected ? 1 : 0 },
            animate: { opacity: selected ? 1 : 0 },
          }
        : { initial: false, animate: { opacity: selected ? 1 : 0 }, transition: TAP_SPRING },

    // 进度条：整条宽度不变，只推 scaleX。
    progress: (ratio) => ({
      initial: false,
      animate: { scaleX: ratio },
      transition: reduce ? { duration: 0 } : SPRING,
    }),
  }
}
