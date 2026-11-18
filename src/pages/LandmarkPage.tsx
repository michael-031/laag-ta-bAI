import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useCheckIn, useLandmark } from '@/api/hooks'
import {
  ArrowBackIcon,
  BookmarkIcon,
  BookmarkOutlineIcon,
  CameraOutlineIcon,
  ChatbubbleEllipsesIcon,
  CheckmarkCircleIcon,
  CheckmarkIcon,
  LocationOutlineIcon,
  PauseIcon,
  ShareSocialOutlineIcon,
  StarIcon,
  VolumeHighOutlineIcon,
} from '@/components/icons/ionicons'
import { LandmarkImage } from '@/components/LandmarkCard'
import { focus, TopNavbar } from '@/components/TopNavbar'
import { useAuth } from '@/features/auth/AuthContext'
import { useBookmarks } from '@/features/bookmarks/useBookmarks'
import { useSpeech } from '@/hooks/useSpeech'
import { CATEGORY_LABELS, formatFee } from '@/lib/format'

/** Set by ScanPage when it navigates here after a match. */
export type ScanMatchState = { confidence: number }

const NO_STORY = { about: '', significance: '', architecture: '', trivia: '' }
const button = `flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold ${focus}`
const secondary = `${button} border border-ivory-line bg-ivory-surface text-ink transition-colors hover:bg-ivory-deep`

/** Pure white sheet-over-photo landmark detail view + sticky action bar (Image 6). */
export default function LandmarkPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  // Read once, then cleared from history so back/forward doesn't show an old scan result again.
  const [match] = useState(() => location.state as ScanMatchState | null)
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  const { bookmarks, isSaved, toggle } = useBookmarks()
  const auth = useAuth()
  const checkIn = useCheckIn()
  const query = useLandmark(id)
  const [copiedLink, setCopiedLink] = useState(false)

  // Offline fallback: read the saved copy when the network request fails (SRS 3.6.3.2).
  const landmark = query.data ?? bookmarks.find((b) => b.id === id)
  const story = landmark?.story ?? NO_STORY
  const speech = useSpeech([story.about, story.significance, story.architecture, story.trivia].join(' '))

  const saved = landmark ? isSaved(landmark.id) : false

  const handleShare = async () => {
    if (!landmark) return
    const shareData = {
      title: landmark.name,
      text: `Discover ${landmark.name} in ${landmark.district}, Cebu on Laag ta bAI`,
      url: window.location.href,
    }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => {})
      return
    }
    await navigator.clipboard?.writeText(window.location.href).catch(() => {})
    setCopiedLink(true)
    window.setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!landmark) {
    const notFound = query.error instanceof ApiError && query.error.status === 404
    return (
      <div className="min-h-dvh bg-ivory">
        <TopNavbar title="Landmark Details" />
        {query.isPending ? (
          <Skeleton />
        ) : (
          <div role="alert" className="m-6 flex flex-col gap-3 rounded-2xl border border-ivory-line bg-ivory-surface p-5">
            <p className="text-lg font-bold text-ink">{notFound ? "We couldn't find this landmark" : "Couldn't load this landmark"}</p>
            <p className="text-sm text-ink-body">
              {notFound
                ? 'It may have been removed. Browse the other heritage sites instead.'
                : 'Check your connection and try again. Landmarks you bookmark are available offline.'}
            </p>
            {notFound ? (
              <Link to="/" className={`${button} bg-navy text-on-navy`}>
                Explore landmarks
              </Link>
            ) : (
              <button type="button" onClick={() => query.refetch()} className={secondary}>
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-ivory-surface text-ink">
      <article className="flex flex-1 flex-col">
        {/* Bright full-bleed hero image with floating white circular controls (Image 6) */}
        <div data-palette="light" className="relative h-[20.5rem] overflow-hidden bg-ivory-deep">
          <LandmarkImage src={landmark.imageUrl} alt={`Photo of ${landmark.name}`} className="absolute inset-0 size-full" />

          <header className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={() => (location.key === 'default' ? navigate('/') : navigate(-1))}
              aria-label="Go back"
              className={`touch-target flex size-12 items-center justify-center rounded-full bg-ivory-surface/95 text-navy shadow-md transition-transform active:scale-95 ${focus}`}
            >
              <ArrowBackIcon size={20} />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label={copiedLink ? 'Link copied' : 'Share landmark'}
                className={`touch-target flex size-12 items-center justify-center rounded-full bg-ivory-surface/95 text-navy shadow-md transition-transform active:scale-95 ${focus}`}
              >
                {copiedLink ? <CheckmarkIcon size={20} /> : <ShareSocialOutlineIcon size={20} />}
              </button>
              <button
                type="button"
                onClick={() => toggle(landmark)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove bookmark' : 'Save for offline reading'}
                className={`touch-target flex size-12 items-center justify-center rounded-full shadow-md transition-transform active:scale-95 ${
                  saved ? 'bg-terracotta text-on-navy' : 'bg-ivory-surface/95 text-navy'
                } ${focus}`}
              >
                {saved ? <BookmarkIcon size={20} /> : <BookmarkOutlineIcon size={20} />}
              </button>
            </div>
          </header>

          {/* Bottom-right photo index pill (Image 6) */}
          <span className="absolute right-4 bottom-10 z-10 rounded-full bg-navy/80 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-sm">
            1/3
          </span>
        </div>

        {/* Pure white overlapping rounded sheet (Image 6) */}
        <div className="relative z-10 -mt-7 flex flex-1 flex-col gap-7 rounded-t-[2rem] bg-ivory-surface px-6 pt-7 pb-8">
          <div className="flex flex-col gap-1.5">
            {match && (
              <p className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 font-mono text-xs font-semibold text-sage-deep">
                <CheckmarkIcon size={14} />
                Landmark matched · {Math.round(match.confidence * 100)}%
              </p>
            )}

            <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-ink">
              {landmark.name}
              <CheckmarkCircleIcon size={18} className="ml-1.5 inline-block align-middle text-sage" />
            </h1>

            <p className="text-sm text-ink-muted">{CATEGORY_LABELS[landmark.category] ?? landmark.category}</p>

            {/* Rating & Hours single line (Image 6) */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-1 text-sm">
              <span className="inline-flex items-center gap-1 font-mono font-bold text-ink">
                <StarIcon size={14} className="text-terracotta" />
                <span aria-hidden>{landmark.rating.toFixed(1)}</span>
                <span className="sr-only">Rated {landmark.rating.toFixed(1)} out of 5</span>
              </span>
              <span className="font-mono text-xs text-ink-muted">({landmark.visitCount.toLocaleString()})</span>
              <span aria-hidden className="text-ink-muted">·</span>
              <span className="font-semibold text-ink">Open</span>
              <span className="text-ink-muted">- {landmark.visitingHours}</span>
            </div>

            {/* Light-gray rounded Location Pill Box (Image 6) */}
            <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-sage-soft/60 px-3.5 py-3 text-sm font-medium text-ink">
              <LocationOutlineIcon size={17} className="shrink-0 text-terracotta-ink" />
              <span className="min-w-0 flex-1 truncate">{landmark.district}, Cebu</span>
            </div>
          </div>

          <Section eyebrow={match ? 'Scan to story' : undefined} title="About">
            <Text value={story.about} className="text-[0.9375rem] leading-6 text-ink-body" />

            <dl className="mt-4 grid grid-cols-3 gap-2">
              <Fact value={`${landmark.estimatedVisitMinutes} min`} label="Typical visit" />
              <Fact value={formatFee(landmark.admissionFee)} label="Admission" />
              <Fact value={landmark.visitCount.toLocaleString()} label="Visits" />
            </dl>

            <div className="mt-4 flex gap-3">
              <Link to={`/landmarks/${landmark.id}/chat`} className={`${secondary} flex-1`}>
                <ChatbubbleEllipsesIcon size={18} />
                Ask bAI, your guide
              </Link>
              {speech.supported && (
                <button
                  type="button"
                  onClick={speech.state === 'playing' ? speech.pause : speech.play}
                  aria-label={speech.state === 'playing' ? 'Pause narration' : 'Listen to the story'}
                  className={`touch-target flex size-12 items-center justify-center rounded-full border border-ivory-line bg-ivory-surface text-ink transition-colors hover:bg-ivory-deep ${focus}`}
                >
                  {speech.state === 'playing' ? <PauseIcon size={19} /> : <VolumeHighOutlineIcon size={19} />}
                </button>
              )}
            </div>
          </Section>

          <Section title="Significance">
            <Text value={story.significance} />
          </Section>

          <Section title="History">
            <ol className="border-l-2 border-ivory-line pl-4">
              <li className="relative">
                <span className="absolute top-2 -left-[1.35rem] size-2.5 rounded-full bg-navy" aria-hidden />
                <Text value={story.architecture} />
              </li>
            </ol>
          </Section>

          <Section title="Trivia">
            <div className="rounded-2xl border border-terracotta/25 bg-terracotta-soft/70 p-4">
              <Text value={story.trivia} className="text-[0.9375rem] leading-6 text-ink" />
            </div>
          </Section>

          <Section title="Nearby Stores">
            <p className="text-sm text-ink-muted">
              No stores are listed near {landmark.name} yet. Partner shops and local favourites will appear here.
            </p>
          </Section>

          {auth.status === 'signed-in' && !match && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => checkIn.mutate(landmark.id)}
                disabled={checkIn.isPending || checkIn.isSuccess}
                className={`${secondary} w-full disabled:opacity-80`}
              >
                {checkIn.isSuccess ? 'Checked in' : "I'm here, check me in"}
              </button>
              {checkIn.isError && (
                <p role="alert" className="text-sm text-danger">
                  Couldn&apos;t check you in. {checkIn.error.message}
                </p>
              )}
            </div>
          )}
        </div>
      </article>

      {/* Pure White Sticky Bottom Action Bar (Image 6) */}
      <footer
        className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t border-ivory-line bg-ivory-surface px-6 pt-3.5"
        style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
      >
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold text-ink">{formatFee(landmark.admissionFee)} entry</p>
          <p className="truncate font-mono text-xs text-ink-muted">{landmark.estimatedVisitMinutes} min visit</p>
        </div>
        <Link
          to="/scan"
          className={`${button} shrink-0 bg-terracotta text-on-navy transition-colors hover:bg-terracotta-ink`}
        >
          <CameraOutlineIcon size={17} />
          Scan another landmark
        </Link>
      </footer>
    </div>
  )
}

function Section({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  const id = `${title.toLowerCase().replace(/\s+/g, '-')}-title`
  return (
    <section aria-labelledby={id} className="border-t border-ivory-line pt-6 first:border-0 first:pt-0">
      {eyebrow && <p className="mb-1 text-xs font-semibold text-ink-muted">{eyebrow}</p>}
      <h2 id={id} className="font-display pb-2 text-xl font-bold text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Story text capped near 70 characters a line, with a note when that part isn't written yet. */
function Text({ value, className = 'text-[0.9375rem] leading-6 text-ink-body' }: { value: string; className?: string }) {
  return value.trim() ? (
    <p className={`max-w-[65ch] ${className}`}>{value}</p>
  ) : (
    <p className="text-sm text-ink-muted italic">This part of the story hasn&apos;t been written yet.</p>
  )
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse items-center gap-0.5 rounded-xl bg-ivory-deep px-2 py-3 text-center">
      <dt className="text-[0.6875rem] text-ink-muted">{label}</dt>
      <dd className="font-mono text-sm leading-6 font-bold text-ink">{value}</dd>
    </div>
  )
}

function Skeleton() {
  return (
    <div role="status" className="animate-pulse">
      <span className="sr-only">Loading landmark</span>
      <div className="h-[20.5rem] bg-ivory-deep" aria-hidden />
      <div className="-mt-7 flex flex-col gap-3 rounded-t-[2rem] bg-ivory-surface px-6 pt-8" aria-hidden>
        <div className="h-6 w-48 rounded bg-ivory-deep" />
        <div className="h-4 w-32 rounded bg-ivory-deep" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 rounded bg-ivory-deep" />
        ))}
      </div>
    </div>
  )
}
