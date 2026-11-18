import type { ComponentType } from 'react'
import { NavLink, useLocation } from 'react-router'
import {
  BookIcon,
  BookOutlineIcon,
  CameraOutlineIcon,
  MapIcon,
  MapOutlineIcon,
  PersonIcon,
  PersonOutlineIcon,
  TrophyIcon,
  TrophyOutlineIcon,
} from './icons/ionicons'

type Icon = ComponentType<{ size?: number; className?: string }>
type Tab = { to: string; label: string; icon: Icon; activeIcon: Icon }

const TABS: Tab[] = [
  { to: '/', label: 'Explore', icon: MapOutlineIcon, activeIcon: MapIcon },
  { to: '/archives', label: 'Archives', icon: BookOutlineIcon, activeIcon: BookIcon },
  { to: '/scan', label: 'Scan', icon: CameraOutlineIcon, activeIcon: CameraOutlineIcon },
  { to: '/mastery', label: 'Mastery', icon: TrophyOutlineIcon, activeIcon: TrophyIcon },
  { to: '/profile', label: 'Profile', icon: PersonOutlineIcon, activeIcon: PersonIcon },
]

/**
 * Floating glassmorphic pill navigation inspired by modern consumer travel apps.
 * The active tab displays a soft pill highlight, filled icon, and visible label;
 * inactive tabs show an outline icon and keep their label as sr-only for screen readers.
 */
export function BottomNav() {
  const { pathname } = useLocation()
  const current = TABS.findIndex((t) => t.to === pathname)
  const onNavigate = (index: number) => {
    document.documentElement.setAttribute('data-tab-direction', index < current ? 'back' : 'forward')
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-center px-3 [view-transition-name:bottom-nav]"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <nav
        aria-label="Main"
        className="pointer-events-auto flex w-full items-center justify-between gap-1 rounded-full border border-ivory-line/90 bg-ivory-surface/90 px-2 py-1.5 shadow-navy backdrop-blur-xl"
      >
        {TABS.map((tab, i) =>
          tab.to === '/scan' ? (
            <ScanTab key={tab.to} tab={tab} animate={i !== current} onClick={() => onNavigate(i)} />
          ) : (
            <TabLink key={tab.to} tab={tab} animate={i !== current} onClick={() => onNavigate(i)} />
          ),
        )}
      </nav>
    </div>
  )
}

function TabLink({ tab, animate, onClick }: { tab: Tab; animate: boolean; onClick: () => void }) {
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/'}
      viewTransition={animate}
      onClick={onClick}
      className={({ isActive }) =>
        `flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
          isActive ? 'bg-navy-soft text-navy' : 'text-ink-muted hover:text-navy'
        }`
      }
    >
      {({ isActive }) => {
        const Icon = isActive ? tab.activeIcon : tab.icon
        return (
          <>
            <Icon size={22} className={isActive ? 'text-navy' : 'text-ink-muted'} />
            <span className={isActive ? 'text-[0.6875rem] leading-none font-bold whitespace-nowrap text-navy' : 'sr-only'}>
              {tab.label}
            </span>
          </>
        )
      }}
    </NavLink>
  )
}

/** Center Lens / Camera Scan pill disc integrated cleanly inside the floating dock. */
function ScanTab({ tab, animate, onClick }: { tab: Tab; animate: boolean; onClick: () => void }) {
  return (
    <NavLink
      to={tab.to}
      viewTransition={animate}
      onClick={onClick}
      className="group flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex size-12 items-center justify-center rounded-full shadow-navy transition-transform group-active:scale-95 ${
              isActive
                ? 'bg-terracotta text-ivory ring-3 ring-terracotta-soft'
                : 'bg-linear-to-br from-terracotta to-navy text-on-navy group-hover:from-terracotta-ink group-hover:to-navy-pressed'
            }`}
          >
            <tab.icon size={24} />
          </span>
          <span className={isActive ? 'text-[0.6875rem] leading-none font-bold text-terracotta-ink' : 'sr-only'}>
            {tab.label}
          </span>
        </>
      )}
    </NavLink>
  )
}
