import { Outlet } from 'react-router'
import { BottomNav } from './BottomNav'
import { RefreshCwOutlineIcon } from './icons/ionicons'

export function AppShell() {
  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <main className="pb-nav">
        <Outlet />
      </main>
      <BottomNav />
      <LandscapeGuard />
    </div>
  )
}

/** Shown on phones held sideways; the app is portrait-only (SRS 3.6.1). */
export function LandscapeGuard() {
  return (
    <div className="landscape-guard fixed inset-0 z-[60] flex-col items-center justify-center gap-3 bg-navy text-center text-on-navy">
      <RefreshCwOutlineIcon size={40} aria-hidden />
      <p className="text-lg font-bold">Please rotate your phone to portrait</p>
    </div>
  )
}
