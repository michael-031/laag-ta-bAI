import type { ReactNode } from 'react'
import { usePreferences } from '@/features/preferences/PreferencesContext'

/**
 * Wayfare-inspired auth layout (Image 1): bright Cebu day/night photo at top with
 * overlaid brand header and bold display line, and an elevated rounded-top bottom sheet.
 */
export function AuthScreen({ children }: { children: ReactNode }) {
  const night = usePreferences().resolvedTheme === 'dark'
  return (
    <div
      data-theme="light"
      className={`relative flex min-h-dvh flex-col bg-navy bg-cover bg-center ${
        night ? "bg-[url('/authenticationBG/LoginNight.webp')]" : "bg-[url('/authenticationBG/LoginDay.webp')]"
      }`}
    >
      <div className="absolute inset-0 bg-linear-to-b from-navy/60 via-navy/20 to-navy/75" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-between pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="px-5">
          <header className="flex items-center justify-between gap-3 text-white">
            <span className="font-mono text-xs font-bold tracking-[0.12em] text-white/90 uppercase">EN</span>
            <p className="font-display text-xl font-bold tracking-tight text-white">
              Laag ta <span className="italic">bAI</span>
            </p>
            <span className="text-xs font-semibold text-white/90">Cebu, PH</span>
          </header>

          <div className="mt-10 mb-8 max-w-[19rem]">
            <p className="font-display text-[2.375rem] leading-[1.04] font-bold tracking-tight text-white drop-shadow-sm">
              Go where the map <span className="italic">runs out.</span>
            </p>
          </div>
        </div>

        <main className="mt-auto">{children}</main>
      </div>
    </div>
  )
}

/** Pure white bottom sheet in day mode (Image 1), switching to crisp dark sheet in night mode. */
export function AuthCard({ children }: { children: ReactNode }) {
  const night = usePreferences().resolvedTheme === 'dark'
  return (
    <section
      className={`rounded-t-[2rem] px-6 pt-7 shadow-2xl ${
        night ? 'bg-navy text-ivory' : 'bg-ivory-surface text-ink'
      }`}
      style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
    >
      {children}
    </section>
  )
}
