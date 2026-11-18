import { Link, Outlet, useLocation } from 'react-router-dom'

export default function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="sticky top-0 z-10 border-b border-warm-100 bg-warm-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-base font-semibold text-ink"
            aria-label="返回宠宠欲动首页"
          >
            宠宠欲动
          </Link>
          {pathname !== '/' && (
            <Link
              to="/"
              className="rounded-full border border-warm-200 px-3 py-1 text-sm text-ink-soft"
            >
              回首页
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-12 pt-5">
        <Outlet />
      </main>
    </div>
  )
}
