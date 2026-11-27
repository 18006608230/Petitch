import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { useMotionTokens } from '../motion.js'

const MotionLink = motion.create(Link)

export default function AppShell() {
  const { pathname } = useLocation()
  const m = useMotionTokens()

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="sticky top-0 z-10 border-b border-warm-100 bg-warm-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <MotionLink
            to="/"
            className="text-base font-semibold text-ink"
            aria-label="返回宠宠欲动首页"
            {...m.press()}
          >
            宠宠欲动
          </MotionLink>
          {pathname !== '/' && (
            <MotionLink
              to="/"
              className="rounded-full border border-warm-200 px-3 py-1 text-sm text-ink-soft"
              {...m.press()}
            >
              回首页
            </MotionLink>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-12 pt-5">
        {/* 路由切换统一在这一处淡入，页面自己不再搞第二套。 */}
        <motion.div key={pathname} {...m.routeFade()}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
