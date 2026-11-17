import { Link } from 'react-router'
import type { LandmarkSummary } from '@/api/types'
import { ArrowForwardIcon, LocationOutlineIcon, MapOutlineIcon, StarIcon } from '@/components/icons/ionicons'
import { CATEGORY_LABELS, formatDistance, formatFee } from '@/lib/format'

export function LandmarkImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={`object-cover ${className ?? ''}`} />
  ) : (
    <div className={`flex items-center justify-center bg-ivory-deep text-ink-muted ${className ?? ''}`} aria-hidden>
      <MapOutlineIcon size={32} />
    </div>
  )
}

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'

function Rating({ value, className = 'text-ink' }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[0.6875rem] leading-4 font-bold ${className}`}>
      <StarIcon size={11} className={className} />
      <span className="sr-only">Rated</span>
      {value.toFixed(1)}
    </span>
  )
}

/**
 * Full-bleed portrait editorial card for horizontal rails (Nearby You), inspired by Image 8.
 */
export function LandmarkTile({ landmark }: { landmark: LandmarkSummary }) {
  return (
    <Link
      to={`/landmarks/${landmark.id}`}
      data-palette="light"
      className={`group relative flex h-64 w-52 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[1.75rem] border border-ivory-line bg-black p-3.5 text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${focus}`}
    >
      <LandmarkImage
        src={landmark.imageUrl}
        alt=""
        className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="max-w-[7.5rem] truncate rounded-full bg-white/95 px-2.5 py-1 font-mono text-[0.6875rem] leading-none font-bold text-black backdrop-blur-sm">
          {formatDistance(landmark.distanceMeters) ?? landmark.district}
        </span>
        <span className="shrink-0 rounded-full bg-white/95 px-2.5 py-1 backdrop-blur-sm">
          <Rating value={landmark.rating} className="text-black" />
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-0.5">
        <p className="font-display line-clamp-2 text-xl leading-snug font-bold tracking-tight text-white">
          {landmark.name}
        </p>
        <p className="text-xs font-medium text-white/85">
          {CATEGORY_LABELS[landmark.category]} ·{' '}
          <span className="font-mono text-[0.6875rem]">{formatFee(landmark.admissionFee)}</span>
        </p>
      </div>
    </Link>
  )
}

/**
 * Magazine-style editorial feature card for Popular Landmarks & Search results (Image 4).
 */
export function LandmarkRow({ landmark }: { landmark: LandmarkSummary }) {
  const distance = formatDistance(landmark.distanceMeters)
  return (
    <Link
      to={`/landmarks/${landmark.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-ivory-line bg-ivory-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${focus}`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-ivory-deep">
        <LandmarkImage
          src={landmark.imageUrl}
          alt=""
          className="size-full transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/20"
          aria-hidden
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[0.6875rem] leading-none font-bold text-black shadow-xs backdrop-blur-sm">
          {formatFee(landmark.admissionFee)}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1 shadow-xs backdrop-blur-sm">
          <Rating value={landmark.rating} className="text-black" />
        </span>
        <span className="absolute right-3 bottom-3 rounded-lg bg-navy px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-on-navy shadow-sm">
          {CATEGORY_LABELS[landmark.category]}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <p className="font-display text-2xl leading-tight font-bold tracking-tight text-ink">
          {landmark.name}
        </p>

        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs text-ink-muted">
          <span className="flex min-w-0 items-center gap-1.5 truncate">
            <LocationOutlineIcon size={14} className="shrink-0 text-ink" />
            <span className="truncate">
              {landmark.district}
              {distance && ` · ${distance}`}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 font-bold text-ink transition-transform duration-200 group-hover:translate-x-0.5">
            Read story
            <ArrowForwardIcon size={12} />
          </span>
        </div>

        <p className="font-mono text-[0.6875rem] text-ink-muted">
          Open · {landmark.visitingHours}
        </p>
      </div>
    </Link>
  )
}
