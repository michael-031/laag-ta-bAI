import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { usePreferences } from '@/features/preferences/PreferencesContext'
import { ArrowForwardIcon } from '@/components/icons/ionicons'

const SLIDES = [
  {
    title: 'Go where the map runs out.',
    headline: 'Every corner has a story.',
    body: 'Discover heritage landmarks, ancestral homes, and coastal stories across Cebu.',
    image: '/authenticationBG/LoginDay.webp',
  },
  {
    title: 'Point, snap, and ask bAI.',
    headline: 'Point. Scan. Step into history.',
    body: 'Take or upload a photo of any landmark and ask bAI where it is or what shaped it.',
    image: '/landmarks/magellan.jpg',
  },
  {
    title: 'Explore Cebu at your own pace.',
    headline: 'Learn more with every laag.',
    body: 'Save places for offline reading, follow walking trails, and collect heritage badges.',
    image: '/onboarding/bridge.webp',
  },
] as const

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'

/**
 * Wayfare-inspired onboarding (Images 1 & 2): bright full-bleed Cebu photography with
 * bold white display headline, and a pure white rounded-top bottom sheet below.
 */
export default function OnboardingPage() {
  const prefs = usePreferences()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const swipeX = useRef<number | null>(null)
  const slide = SLIDES[index]
  const last = index === SLIDES.length - 1

  const finish = (completed: boolean) => {
    prefs.update({ onboarded: true })
    if (completed) navigate('/permissions', { replace: true, state: { next: '/register' } })
    else navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-ivory-surface text-ink">
      {/* Stays mounted so screen readers announce each slide change. */}
      <p role="status" className="sr-only">{`Page ${index + 1} of ${SLIDES.length}: ${slide.headline}`}</p>

      <main
        className="flex flex-1 touch-pan-y flex-col select-none"
        onPointerDown={(e) => {
          swipeX.current = e.clientX
          e.currentTarget.setPointerCapture?.(e.pointerId)
        }}
        onPointerCancel={() => (swipeX.current = null)}
        onPointerUp={(e) => {
          if (swipeX.current === null) return
          const dx = e.clientX - swipeX.current
          swipeX.current = null
          if (dx < -50 && !last) setIndex(index + 1)
          if (dx > 50 && index > 0) setIndex(index - 1)
        }}
      >
        <div key={index} className="flex flex-1 flex-col animate-[fade-in_300ms_ease-out] motion-reduce:animate-none">
          {/* Bright full-bleed Cebu photography (Images 1 & 2) */}
          <section data-palette="light" className="relative flex min-h-[56dvh] flex-col justify-between overflow-hidden bg-navy px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-14 text-white">
            <img
              src={slide.image}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className="absolute inset-0 bg-linear-to-b from-navy/60 via-navy/20 to-navy/75"
              aria-hidden
            />

            <header className="relative z-10 flex items-center justify-between">
              <span className="inline-flex min-h-12 items-center px-1 font-mono text-xs font-bold tracking-[0.12em] text-white/95 uppercase">
                EN
              </span>
              <p className="font-display text-xl font-bold tracking-tight text-white" role="img" aria-label="Laag ta bAI">
                Laag ta <span className="italic">bAI</span>
              </p>
              <button
                type="button"
                onClick={() => finish(false)}
                aria-label="Skip onboarding"
                className="touch-target flex items-center justify-end px-1 text-sm font-semibold text-white/95 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white"
              >
                Skip
              </button>
            </header>

            <div className="relative z-10 mt-auto max-w-[19rem] pt-8">
              <p className="font-display text-[2.5rem] leading-[1.04] font-bold tracking-tight text-white drop-shadow-sm">
                {slide.title}
              </p>
            </div>
          </section>

          {/* Pure White Bottom Sheet */}
          <section className="relative z-10 -mt-7 flex flex-1 flex-col justify-center rounded-t-[2rem] bg-ivory-surface px-6 pt-7">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight text-ink">{slide.headline}</h1>
              <p className="text-sm leading-6 text-ink-body">{slide.body}</p>
            </div>
          </section>
        </div>
      </main>

      <footer
        className="flex flex-wrap items-center justify-between gap-2 bg-ivory-surface px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="-ml-4 flex">
          {SLIDES.map((s, i) => (
            <button
              key={s.headline}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Page ${i + 1} of ${SLIDES.length}`}
              aria-current={i === index ? 'step' : undefined}
              className={`touch-target flex items-center justify-center rounded-full ${focusRing}`}
            >
              <span
                className={`block h-2 rounded-full transition-all motion-reduce:transition-none ${
                  i === index ? 'w-6 bg-terracotta' : 'w-2 bg-ivory-line'
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish(true) : setIndex(index + 1))}
          className={`ml-auto flex h-13 shrink-0 items-center gap-2 rounded-xl bg-navy px-6 text-sm font-bold text-on-navy transition-colors hover:bg-navy-pressed active:bg-navy-pressed ${focusRing}`}
        >
          {last ? 'Start exploring' : 'Next'}
          <ArrowForwardIcon size={17} />
        </button>
      </footer>
    </div>
  )
}
