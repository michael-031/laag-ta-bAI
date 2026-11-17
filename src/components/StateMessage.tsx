import type { ReactNode } from 'react'
import { CompassOutlineIcon, InformationCircleOutlineIcon } from '@/components/icons/ionicons'

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2.5 py-10 text-sm font-medium text-ink-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-ivory-line border-t-navy" aria-hidden />
      {label}
    </div>
  )
}

export function ErrorMessage({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : 'Something went wrong.'
  return (
    <div role="alert" className="mx-5 my-4 rounded-2xl border border-danger-line bg-danger-soft p-4 text-sm text-danger">
      <p className="flex items-center gap-2 font-semibold">
        <InformationCircleOutlineIcon size={18} className="shrink-0" /> {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="touch-target mt-2 inline-flex items-center text-sm font-bold text-danger underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="mx-5 flex flex-col items-center gap-2 rounded-3xl border border-ivory-line bg-ivory-surface p-8 text-center">
      <div className="text-terracotta-ink">{icon ?? <CompassOutlineIcon size={28} />}</div>
      <p className="font-bold text-ink">{title}</p>
      {children && <div className="text-sm text-ink-muted">{children}</div>}
    </div>
  )
}
