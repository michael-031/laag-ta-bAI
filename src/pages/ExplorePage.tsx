import { useDeferredValue, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { useLandmarks } from '@/api/hooks'
import type { LandmarkCategory, LandmarkSummary } from '@/api/types'
import {
  BookmarkOutlineIcon,
  CameraOutlineIcon,
  LocateOutlineIcon,
  LocationOutlineIcon,
  OptionsOutlineIcon,
  SearchIcon,
  StarIcon,
} from '@/components/icons/ionicons'
import { LandmarkImage, LandmarkRow, LandmarkTile } from '@/components/LandmarkCard'
import { useGeolocation, type GeoState } from '@/hooks/useGeolocation'
import { CATEGORY_LABELS, formatFee } from '@/lib/format'

const CATEGORIES = Object.keys(CATEGORY_LABELS) as LandmarkCategory[]
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'
const PRIVACY = 'Your coordinates are sent to our server only to sort nearby landmarks and verify scans.'

export default function ExplorePage() {
  const geo = useGeolocation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<LandmarkCategory | undefined>()
  const [freeOnly, setFreeOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const q = useDeferredValue(search)

  const { rationaleAccepted, status, request } = geo
  useEffect(() => {
    if (rationaleAccepted && status === 'idle') request()
  }, [rationaleAccepted, status, request])

  const coords = geo.coords ? { lat: geo.coords.lat, lng: geo.coords.lng } : {}
  // Waits for coordinates: without them the radius means nothing and the request is wasted data.
  const nearby = useLandmarks({ ...coords, radiusKm: 5, limit: 10 }, { enabled: geo.status === 'ready' })
  const results = useLandmarks({ q: q || undefined, category, free: freeOnly || undefined, ...coords })
  const filtering = Boolean(q || category || freeOnly)

  const chip = (pressed: boolean) =>
    `min-h-12 rounded-full border px-4 text-xs font-semibold transition-colors ${focus} ${
      pressed
        ? 'border-navy bg-navy text-on-navy'
        : 'border-ivory-line bg-ivory-deep text-ink hover:border-line-strong'
    }`

  const sortedPopular = results.data ? [...results.data].sort((a, b) => b.rating - a.rating) : []
  const spotlight = sortedPopular.length > 1 ? sortedPopular[0] : null
  const popularList = spotlight ? sortedPopular.slice(1) : sortedPopular

  return (
    <div className="bleed-under-nav flex min-h-dvh flex-col gap-6 bg-ivory text-ink">
      {/* Clean scenic Cebu header with overlapping Google-style search pill (Image 4) */}
      <div>
        <header
          data-palette="light"
          className="relative overflow-hidden bg-black px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-14 text-white"
        >
          <img
            src="/authenticationBG/LoginDay.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-b from-black/35 via-black/15 to-black/55"
            aria-hidden
          />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-black shadow-xs backdrop-blur-md">
              <LocationOutlineIcon size={14} />
              Cebu, PH
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/archives"
                aria-label="Saved places"
                className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-xs backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white"
              >
                <BookmarkOutlineIcon size={20} />
              </Link>
              <Link
                to="/scan"
                aria-label="Open visual AI scanner"
                className="flex size-12 items-center justify-center rounded-full bg-white/90 text-black shadow-xs backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-white"
              >
                <CameraOutlineIcon size={20} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-col items-center text-center">
            <h1 className="font-display text-5xl font-bold tracking-tight text-white drop-shadow-sm">Explore</h1>
            <p className="font-display mt-1 text-lg italic text-white/95 drop-shadow-xs">Discover the heart of Cebu</p>
          </div>
        </header>

        {/* Overlapping White Pill Search Bar */}
        <div className="relative z-10 -mt-7 px-5">
          <div className="flex items-center gap-1 rounded-full border border-ivory-line bg-ivory-surface py-1 pr-1.5 pl-4 shadow-md focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-navy">
            <label className="flex min-w-0 flex-1 items-center gap-2.5">
              <SearchIcon size={18} className="shrink-0 text-ink-muted" />
              <span className="sr-only">Search landmarks</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search landmarks, museums..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              />
            </label>
            <Link
              to="/scan"
              aria-label="Scan landmark with AI camera"
              className={`touch-target flex shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ivory-deep ${focus}`}
            >
              <CameraOutlineIcon size={20} />
            </Link>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-label="Filters"
              className={`touch-target flex shrink-0 items-center justify-center rounded-full transition-colors ${
                showFilters ? 'bg-navy text-on-navy' : 'text-ink hover:bg-ivory-deep'
              } ${focus}`}
            >
              <OptionsOutlineIcon size={20} />
            </button>
          </div>

          {/* Minimal Mode & Category Pills Row (Image 4) */}
          <div className="-mx-5 mt-3 flex items-center gap-2 overflow-x-auto px-5 pb-1">
            <Link
              to="/scan"
              className={`inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full border border-ivory-line bg-ivory-deep px-4 text-xs font-bold text-ink transition-colors hover:border-line-strong ${focus}`}
            >
              <CameraOutlineIcon size={15} />
              AI Mode
            </Link>
            <button
              type="button"
              onClick={() => setFreeOnly((v) => !v)}
              aria-pressed={freeOnly}
              className={`${chip(freeOnly)} shrink-0`}
            >
              Free entry
            </button>
            {CATEGORIES.slice(0, 4).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? undefined : c)}
                aria-pressed={category === c}
                className={`${chip(category === c)} shrink-0`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2 rounded-2xl border border-ivory-line bg-ivory-surface p-3" role="group" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(category === c ? undefined : c)}
                  aria-pressed={category === c}
                  className={chip(category === c)}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
              <button type="button" onClick={() => setFreeOnly((v) => !v)} aria-pressed={freeOnly} className={chip(freeOnly)}>
                Free entry
              </button>
            </div>
          )}
        </div>
      </div>

      {filtering ? (
        <section className="flex flex-col gap-3 px-5" aria-label="Search results">
          {results.isPending ? (
            <RowSkeletons label="Searching landmarks" />
          ) : results.isError ? (
            <ErrorNotice onRetry={() => results.refetch()} />
          ) : results.data.length === 0 ? (
            <Notice title="No matches">Try another name, or clear the filters.</Notice>
          ) : (
            results.data.map((l) => <LandmarkRow key={l.id} landmark={l} />)
          )}
        </section>
      ) : (
        <>
          {spotlight && <SpotlightCard landmark={spotlight} />}

          <MapPreview geo={geo} />

          <section className="flex flex-col gap-3.5" aria-labelledby="nearby-title">
            <div className="px-5">
              <h2 id="nearby-title" className="font-display text-[1.625rem] font-bold tracking-tight text-ink">
                Nearby You
              </h2>
              <p className="text-xs text-ink-muted">Within a 5 km radius</p>
            </div>
            <div className="px-5 empty:hidden">
              {geo.status === 'idle' && (
                <Notice
                  title="See what's near you"
                  action={
                    <button
                      type="button"
                      onClick={geo.request}
                      className={`mt-1 h-12 w-full rounded-full bg-navy px-6 text-sm font-bold text-on-navy transition-colors hover:bg-navy-pressed ${focus}`}
                    >
                      Share location
                    </button>
                  }
                >
                  Share your location to sort landmarks by distance. {PRIVACY}
                </Notice>
              )}
              {(geo.status === 'denied' || geo.status === 'unavailable') && (
                <Notice
                  title={geo.status === 'denied' ? 'Location is off' : "We couldn't find you"}
                  action={<RetryButton onClick={geo.request} />}
                >
                  {geo.status === 'denied'
                    ? 'To see landmarks near you, allow location for Laag ta bAI in your browser or phone settings, then tap Try again.'
                    : geo.error}
                </Notice>
              )}
              {geo.status === 'ready' && nearby.isError && <ErrorNotice onRetry={() => nearby.refetch()} />}
              {geo.status === 'ready' && nearby.data?.length === 0 && (
                <Notice title="Nothing within 5 km">No heritage sites are close by yet. Browse the popular ones below.</Notice>
              )}
            </div>
            {(geo.status === 'locating' || (geo.status === 'ready' && nearby.isPending)) && <TileSkeletons />}
            {geo.status === 'ready' && nearby.data && nearby.data.length > 0 && (
              <ul className="flex snap-x scroll-px-5 gap-3.5 overflow-x-auto px-5 pb-2">
                {nearby.data.map((l) => (
                  <li key={l.id} className="flex">
                    <LandmarkTile landmark={l} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-4 px-5" aria-labelledby="popular-title">
            <div className="flex items-baseline justify-between gap-2">
              <h2 id="popular-title" className="font-display text-[1.625rem] font-bold tracking-tight text-ink">
                Popular Landmarks
              </h2>
              {popularList.length > 0 && (
                <span className="font-mono text-xs text-ink-muted">{popularList.length} spots</span>
              )}
            </div>
            {results.isPending ? (
              <RowSkeletons label="Loading popular landmarks" />
            ) : results.isError ? (
              <ErrorNotice onRetry={() => results.refetch()} />
            ) : popularList.length === 0 ? (
              <Notice title="No landmarks yet">Check back soon.</Notice>
            ) : (
              <ul className="flex flex-col gap-4">
                {popularList.map((l) => (
                  <li key={l.id}>
                    <LandmarkRow landmark={l} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

/** Clean editorial featured card inspired by Image 8 ("Today"). */
function SpotlightCard({ landmark }: { landmark: LandmarkSummary }) {
  return (
    <section className="px-5" aria-label="Today">
      <h2 className="font-display mb-3 text-[1.625rem] font-bold tracking-tight text-ink">Today</h2>
      <Link
        to={`/landmarks/${landmark.id}`}
        data-palette="light"
        className={`group relative block h-60 overflow-hidden rounded-[1.75rem] border border-ivory-line bg-black ${focus}`}
      >
        <LandmarkImage
          src={landmark.imageUrl}
          alt={`Photo of ${landmark.name}`}
          className="size-full transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent"
          aria-hidden
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-black shadow-xs backdrop-blur-sm">
          {CATEGORY_LABELS[landmark.category]}
        </span>
        <div className="absolute inset-x-5 bottom-4 flex flex-col gap-1 text-white">
          <p className="font-display text-2xl leading-tight font-bold tracking-tight">{landmark.name}</p>
          <p className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-white/90">
            <span className="inline-flex items-center gap-1 font-mono font-bold">
              <StarIcon size={12} />
              {landmark.rating.toFixed(1)}
            </span>
            <span aria-hidden>•</span>
            <span>{landmark.district}</span>
            <span aria-hidden>•</span>
            <span className="font-mono">{formatFee(landmark.admissionFee)}</span>
          </p>
        </div>
      </Link>
    </section>
  )
}

const MAP_LABEL: Record<GeoState['status'], string> = {
  ready: 'Map of your area. The navy pin marks your current location.',
  locating: 'Map of your area. Finding your location.',
  idle: 'Map of Cebu. Share your location to see where you are.',
  denied: 'Map of Cebu. Location is off.',
  unavailable: 'Map of Cebu. Your location could not be found.',
}

function MapPreview({ geo }: { geo: ReturnType<typeof useGeolocation> }) {
  const located = geo.status === 'ready'
  return (
    <section className="px-5" aria-label="Map">
      <div className="relative h-44 overflow-hidden rounded-3xl border border-ivory-line bg-ivory-deep">
        <div role="img" aria-label={MAP_LABEL[geo.status]} className="absolute inset-0">
          <svg viewBox="0 0 392 224" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
            <path d="M300 224C330 190 360 185 392 170V224H300Z" className="fill-ivory-line/70" />
            <g fill="none" strokeLinecap="round" className="stroke-ivory-surface">
              <path strokeWidth={10} d="M-10 200L120 120L260 70L410 20" />
              <path strokeWidth={5} d="M-10 60L150 90L300 150L410 170M90 -10L120 120L150 240M250 -10L260 70L280 240" />
              <path strokeWidth={3} d="M-10 140L60 150L200 180L410 200M30 -10L60 150L40 240M340 -10L330 90L360 240M150 90L200 180" />
            </g>
          </svg>
          {(located || geo.status === 'locating') && (
            <span
              className={`absolute top-1/2 left-1/2 size-6 -translate-1/2 rounded-full border-[3px] border-ivory-surface bg-navy shadow-md ${located ? '' : 'animate-pulse'}`}
            />
          )}
          {!located && geo.status !== 'locating' && (
            <span className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-ivory-line bg-ivory-surface px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap text-ink shadow-xs">
              {geo.status === 'denied' ? 'Location is off' : 'Location not shared'}
            </span>
          )}
        </div>
        {geo.status !== 'idle' && geo.status !== 'denied' && (
          <button
            type="button"
            onClick={geo.request}
            disabled={geo.status === 'locating'}
            aria-label="Recenter on my location"
            className={`absolute right-3 bottom-3 flex size-12 items-center justify-center rounded-full border border-ivory-line bg-ivory-surface text-ink shadow-sm disabled:opacity-80 ${focus}`}
          >
            <LocateOutlineIcon size={20} />
          </button>
        )}
      </div>
    </section>
  )
}

function Notice({ title, children, action, alert }: { title: string; children?: ReactNode; action?: ReactNode; alert?: boolean }) {
  return (
    <div role={alert ? 'alert' : undefined} className="flex flex-col gap-2 rounded-2xl border border-ivory-line bg-ivory-surface p-4">
      <p className="text-base font-bold text-ink">{title}</p>
      {children && <p className="text-xs leading-5 text-ink-body">{children}</p>}
      {action}
    </div>
  )
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`touch-target self-start text-sm font-bold text-ink underline ${focus}`}>
      Try again
    </button>
  )
}

function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <Notice alert title="Couldn't load landmarks" action={<RetryButton onClick={onRetry} />}>
      Check your connection and try again.
    </Notice>
  )
}

function TileSkeletons() {
  return (
    <div role="status" className="flex gap-3.5 overflow-hidden px-5 pb-2">
      <span className="sr-only">Loading nearby landmarks</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-64 w-52 shrink-0 animate-pulse rounded-[1.75rem] border border-ivory-line bg-ivory-deep" aria-hidden />
      ))}
    </div>
  )
}

function RowSkeletons({ label }: { label: string }) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-[1.75rem] border border-ivory-line bg-ivory-surface" aria-hidden>
          <div className="h-48 w-full animate-pulse bg-ivory-deep" />
          <div className="space-y-2 p-4">
            <div className="h-6 w-2/3 animate-pulse rounded bg-ivory-deep" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-ivory-deep" />
          </div>
        </div>
      ))}
    </div>
  )
}
