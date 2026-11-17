import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ArrowBackIcon } from '@/components/icons/ionicons'

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: boolean; action?: ReactNode }) {
  const navigate = useNavigate()
  return (
    <header className="pt-safe flex items-center gap-2 px-5 pb-4">
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="touch-target -ml-2 flex items-center justify-center rounded-full text-navy transition-colors hover:bg-navy-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          <ArrowBackIcon size={22} />
        </button>
      )}
      <div className={back ? 'min-w-0 flex-1' : 'min-w-0 flex-1 text-center'}>
        <h1 className={`${back ? 'text-xl' : 'text-3xl'} truncate font-extrabold tracking-tight text-ink`}>{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
