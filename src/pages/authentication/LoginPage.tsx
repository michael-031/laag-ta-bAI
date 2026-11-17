import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { AuthCard, AuthScreen } from '@/components/AuthScreen'
import {
  EyeOffOutlineIcon,
  EyeOutlineIcon,
  LockClosedOutlineIcon,
  LogoGoogleIcon,
  MailOutlineIcon,
} from '@/components/icons/ionicons'
import { useAuth } from '@/features/auth/AuthContext'
import { DevSignIn } from '@/features/auth/DevSignIn'
import { signInErrorMessage } from '@/features/auth/signInError'
import { usePreferences } from '@/features/preferences/PreferencesContext'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Wayfare-inspired login bottom sheet (Images 1 & 3): pure white bottom sheet in light mode
 * with solid black primary button, 1px-bordered secondary buttons, and clean passive footer.
 */
export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const night = usePreferences().resolvedTheme === 'dark'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState<'password' | 'google' | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (auth.status === 'signed-in') return <Navigate to="/" replace />

  const emailValid = EMAIL.test(email.trim())
  const emailError = submitted && !emailValid ? (email.trim() ? 'Enter a valid email address.' : 'Enter your email.') : null
  const passwordError = submitted && !password ? 'Enter your password.' : null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    setError(null)
    if (!emailValid || !password) return
    setBusy('password')
    try {
      await auth.signIn(email.trim(), password)
      navigate('/', { replace: true })
    } catch (e) {
      setError(signInErrorMessage(e))
      setBusy(null)
    }
  }

  const continueWithGoogle = async () => {
    setError(null)
    setBusy('google')
    try {
      await auth.signInWithGoogle()
    } catch (e) {
      setError(signInErrorMessage(e, 'Google sign-in failed. Please try again.'))
      setBusy(null)
    }
  }

  const focus = night
    ? 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory'
    : 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'
  const well = night ? 'bg-navy-pressed/70 border-ivory/30 text-ivory' : 'bg-ivory-deep border-ivory-line text-ink'

  return (
    <AuthScreen>
      <AuthCard>
        <header className="flex flex-col items-center text-center">
          <p lang="ceb" className={`font-display text-sm italic ${night ? 'text-ivory/75' : 'text-ink-muted'}`}>
            Maayong pagbalik
          </p>
          <h1 className={`font-display pt-0.5 text-3xl font-bold tracking-tight ${night ? 'text-ivory' : 'text-ink'}`}>Log In</h1>
        </header>

        <form noValidate onSubmit={submit} aria-busy={busy === 'password'} className="mt-5 flex flex-col gap-3.5">
          <Field label="Email" icon={<MailOutlineIcon size={19} />} error={emailError} well={well} night={night}>
            {(props) => (
              <input
                {...props}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="explorer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Field>
          <Field
            label="Password"
            icon={<LockClosedOutlineIcon size={19} />}
            error={passwordError}
            well={well}
            night={night}
            action={
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className={`touch-target -mr-3 flex shrink-0 items-center justify-center rounded-full ${
                  night ? 'text-ivory/85 hover:text-ivory' : 'text-ink-muted hover:text-ink'
                } ${focus}`}
              >
                {showPassword ? <EyeOffOutlineIcon size={19} /> : <EyeOutlineIcon size={19} />}
              </button>
            }
          >
            {(props) => (
              <input
                {...props}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Field>

          {error && (
            <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy !== null}
            className={`mt-2 min-h-13 w-full rounded-xl text-sm font-bold transition-colors disabled:opacity-70 ${
              night
                ? 'bg-ivory text-navy hover:bg-ivory/90'
                : 'bg-navy text-on-navy hover:bg-navy-pressed'
            } ${focus}`}
          >
            {busy === 'password' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        {auth.mode === 'supabase' && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={continueWithGoogle}
              disabled={busy !== null}
              aria-busy={busy === 'google'}
              aria-label="Continue with Google"
              className={`flex min-h-13 w-full items-center justify-center gap-2.5 rounded-xl border px-4 text-sm font-semibold transition-colors disabled:opacity-70 ${
                night
                  ? 'border-ivory/25 bg-ivory-surface text-ink hover:bg-ivory'
                  : 'border-ivory-line bg-ivory-surface text-ink hover:bg-ivory-deep'
              } ${focus}`}
            >
              <LogoGoogleIcon size={18} />
              Continue with Google
            </button>
          </div>
        )}

        {auth.mode === 'dev' && (
          <div className="mt-4">
            <DevSignIn tone="notice" />
          </div>
        )}

        <div className="mt-2.5 flex justify-center">
          <Link
            to="/"
            className={`flex min-h-12 w-full items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors ${
              night
                ? 'border-ivory/25 bg-transparent text-ivory hover:bg-ivory/10'
                : 'border-ivory-line bg-ivory-surface text-ink hover:bg-ivory-deep'
            } ${focus}`}
          >
            Continue as Guest
          </Link>
        </div>

        {/* Clean passive footer (Image 3) */}
        <p className={`mt-3 flex flex-wrap items-center justify-center gap-x-1.5 text-sm ${night ? 'text-ivory/80' : 'text-ink-muted'}`}>
          New here?
          <Link
            to="/register"
            className={`flex min-h-12 items-center rounded-lg font-bold underline underline-offset-4 ${
              night ? 'text-ivory' : 'text-ink'
            } ${focus}`}
          >
            Create Account
          </Link>
        </p>

        <p className={`mt-0.5 text-center text-xs ${night ? 'text-ivory/65' : 'text-ink-muted'}`}>
          By continuing you agree to our{' '}
          <Link to="/terms" className="underline underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline underline-offset-2">
            Privacy
          </Link>
        </p>
      </AuthCard>
    </AuthScreen>
  )
}

type InputProps = { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string }

function Field({
  label,
  icon,
  error,
  well,
  night,
  action,
  children,
}: {
  label: string
  icon: ReactNode
  error: string | null
  well: string
  night: boolean
  action?: ReactNode
  children: (props: InputProps) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={`text-xs font-semibold ${night ? 'text-ivory/85' : 'text-ink-body'}`}>
        {label}
      </label>
      <div
        className={`flex h-13 items-center gap-3 rounded-xl border px-3.5 focus-within:outline-2 focus-within:outline-offset-2 ${
          night ? 'focus-within:outline-ivory' : 'focus-within:outline-navy'
        } ${well} ${error ? 'border-danger-line' : ''}`}
      >
        <span className={`shrink-0 ${night ? 'text-ivory/75' : 'text-ink-muted'}`}>{icon}</span>
        {children({
          id,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? errorId : undefined,
          className: `h-full min-w-0 flex-1 bg-transparent text-sm outline-none ${
            night ? 'text-ivory placeholder:text-ivory/60' : 'text-ink placeholder:text-ink-muted'
          }`,
        })}
        {action}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
