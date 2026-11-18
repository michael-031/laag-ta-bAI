import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Markdown from 'react-markdown'
import { answerAboutLandmark, matchLandmarkFromFile } from '@/api/demoData'
import { useChat, useLandmark } from '@/api/hooks'
import type { ChatMessage } from '@/api/types'
import {
  AddOutlineIcon,
  ArrowBackIcon,
  ArrowUpIcon,
  CameraOutlineIcon,
  ChevronDownOutlineIcon,
  CompassOutlineIcon,
  CopyOutlineIcon,
  DownloadOutlineIcon,
  LocationOutlineIcon,
  StarIcon,
  ThumbsDownOutlineIcon,
  ThumbsUpOutlineIcon,
  TrashOutlineIcon,
} from '@/components/icons/ionicons'
import { LandmarkImage } from '@/components/LandmarkCard'
import { ErrorMessage, Loading } from '@/components/StateMessage'
import { CATEGORY_LABELS, formatFee } from '@/lib/format'
import { ACCEPTED_IMAGE_TYPES, validateImage } from '@/lib/image'
import { readJson, removeKey, writeJson } from '@/lib/storage'

type StoredMessage = ChatMessage & {
  at: string
  imagePreview?: string
  feedback?: 'up' | 'down'
}

const greeting = (name: string): StoredMessage => ({
  role: 'model',
  content: `Maayong adlaw! Ask me where **${name}** is, its history, entrance details, or attach a photo to ask about it.`,
  at: new Date().toISOString(),
})

const QUICK_PROMPTS = [
  'Where is this place?',
  "What's the history?",
  'Fees & opening hours?',
  'What is nearby?',
]

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'

/** Clean white conversational AI guide seeded with the landmark (Image 7). */
export default function ChatPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const landmark = useLandmark(id)
  const chat = useChat()
  const storageKey = `chat:${id}`
  const [messages, setMessages] = useState<StoredMessage[]>(() => readJson(storageKey, []))
  const [draft, setDraft] = useState('')
  const [attachedImage, setAttachedImage] = useState<{ preview: string; file: File } | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const shown = messages.length || !landmark.data ? messages : [greeting(landmark.data.name)]

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [shown.length, chat.isPending])

  const persist = (next: StoredMessage[]) => {
    setMessages(next)
    writeJson(
      storageKey,
      next.slice(-60).map((m) => ({ role: m.role, content: m.content, at: m.at, feedback: m.feedback })),
    )
  }

  const sendMessage = (rawText: string) => {
    const text = rawText.trim() || (attachedImage ? 'Where is this place?' : '')
    if (!text || chat.isPending || !landmark.data) return
    setImageError(null)

    const userMsg: StoredMessage = {
      role: 'user',
      content: text,
      at: new Date().toISOString(),
      imagePreview: attachedImage?.preview,
    }
    const next = [...shown, userMsg]
    persist(next)
    setDraft('')

    const photoLandmark = attachedImage ? matchLandmarkFromFile(attachedImage.file) : null
    setAttachedImage(null)

    if (photoLandmark && photoLandmark.id !== landmark.data.id) {
      const photoReply: StoredMessage = {
        role: 'model',
        content: answerAboutLandmark(photoLandmark, text),
        at: new Date().toISOString(),
      }
      persist([...next, photoReply])
      return
    }

    chat.mutate(
      {
        landmarkId: id,
        messages: next
          .filter((m, i) => !(i === 0 && m.role === 'model'))
          .map(({ role, content }) => ({ role, content })),
      },
      {
        onSuccess: (result) => persist([...next, { ...result.message, at: new Date().toISOString() }]),
      },
    )
  }

  const send = (event: FormEvent) => {
    event.preventDefault()
    sendMessage(draft)
  }

  const onAttachPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImageError(null)
    const check = await validateImage(file)
    if (!check.ok) {
      setImageError(check.reason)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImage({ preview: reader.result, file })
      }
    }
    reader.readAsDataURL(file)
  }

  const rateMessage = (index: number, value: 'up' | 'down') => {
    const updated = shown.map((m, i) => (i === index ? { ...m, feedback: value } : m))
    persist(updated)
  }

  const transcript = () =>
    shown.map((m) => `[${new Date(m.at).toLocaleString()}] ${m.role === 'user' ? 'You' : 'bAI'}: ${m.content}`).join('\n\n')

  const exportChat = () => {
    const url = URL.createObjectURL(new Blob([transcript()], { type: 'text/plain' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `laag-ta-bai-${id}-chat.txt` })
    a.click()
    URL.revokeObjectURL(url)
  }

  if (landmark.isPending) return <Loading />
  if (landmark.isError) return <ErrorMessage error={landmark.error} onRetry={() => landmark.refetch()} />

  const spot = landmark.data
  const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-ivory text-ink">
      {/* Clean White Header (Image 7) */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-ivory/95 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className={`touch-target flex size-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-ivory-deep ${focus}`}
        >
          <ArrowBackIcon size={20} />
        </button>

        <Link
          to={`/landmarks/${spot.id}`}
          className={`inline-flex min-h-12 max-w-[13rem] items-center gap-1.5 rounded-full bg-ivory-deep px-4 text-xs font-bold text-ink transition-colors hover:bg-ivory-line ${focus}`}
        >
          <span className="truncate">{spot.name}</span>
          <ChevronDownOutlineIcon size={14} className="shrink-0 text-ink-muted" />
        </Link>

        <div className="flex items-center">
          <IconButton label="Copy chat" onClick={() => navigator.clipboard?.writeText(transcript())} icon={<CopyOutlineIcon size={18} />} />
          <IconButton label="Export chat" onClick={exportChat} icon={<DownloadOutlineIcon size={18} />} />
          <IconButton
            label="Clear chat"
            onClick={() => {
              removeKey(storageKey)
              setMessages([])
            }}
            icon={<TrashOutlineIcon size={18} />}
          />
        </div>
      </header>

      <h1 className="sr-only">Ask bAI about {spot.name}</h1>

      <div className="flex-1 px-5 pb-4">
        <p className="mb-5 text-center font-mono text-[0.6875rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
          TODAY, {todayLabel}
        </p>

        <ol className="space-y-5" aria-live="polite">
          {shown.map((m, i) =>
            m.role === 'user' ? (
              <li key={i} className="flex flex-col items-end gap-1.5">
                {m.imagePreview && (
                  <img
                    src={m.imagePreview}
                    alt="Uploaded landmark photo"
                    className="h-36 w-44 rounded-2xl border border-ivory-line object-cover"
                  />
                )}
                <div className="max-w-[82%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-sm font-medium text-on-navy">
                  <div className="markdown leading-6">
                    <Markdown>{m.content}</Markdown>
                  </div>
                </div>
              </li>
            ) : (
              <li key={i} className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-terracotta-soft text-terracotta-ink">
                    <CompassOutlineIcon size={14} />
                  </span>
                  <div className="min-w-0 flex-1 text-sm leading-6 text-ink">
                    <div className="markdown">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                </div>

                {/* Clean White Summary Card (Image 7) */}
                <Link
                  to={`/landmarks/${spot.id}`}
                  className={`ml-8.5 flex flex-col gap-3 rounded-2xl border border-ivory-line bg-ivory-surface p-3.5 shadow-xs transition-colors hover:bg-ivory-deep/40 ${focus}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-13 shrink-0 overflow-hidden rounded-xl bg-ivory-deep">
                      <LandmarkImage src={spot.imageUrl} alt="" className="size-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display truncate text-base font-bold text-ink">{spot.name}</p>
                      <span className="mt-1 inline-block rounded-md bg-terracotta-soft px-2 py-0.5 text-[0.6875rem] font-medium text-terracotta-ink">
                        {CATEGORY_LABELS[spot.category] ?? spot.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ivory-line pt-2.5 font-mono text-xs text-ink-muted">
                    <span className="font-bold text-ink">{formatFee(spot.admissionFee)}</span>
                    <span className="inline-flex items-center gap-1">
                      <StarIcon size={12} className="text-terracotta" />
                      {spot.rating.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1 truncate font-sans">
                      <LocationOutlineIcon size={12} className="text-sage-deep" />
                      {spot.district}
                    </span>
                    <span>{spot.estimatedVisitMinutes} min</span>
                  </div>
                </Link>

                {/* Feedback row (Image 7) */}
                <div className="ml-8.5 flex items-center gap-1 text-xs text-ink-muted">
                  <span className="mr-1">Does this look right?</span>
                  <button
                    type="button"
                    aria-label="Helpful response"
                    aria-pressed={m.feedback === 'up'}
                    onClick={() => rateMessage(i, 'up')}
                    className={`touch-target flex items-center justify-center rounded-full transition-colors ${
                      m.feedback === 'up' ? 'bg-ivory-deep text-ink' : 'hover:bg-ivory-deep/60'
                    }`}
                  >
                    <ThumbsUpOutlineIcon size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Needs improvement"
                    aria-pressed={m.feedback === 'down'}
                    onClick={() => rateMessage(i, 'down')}
                    className={`touch-target flex items-center justify-center rounded-full transition-colors ${
                      m.feedback === 'down' ? 'bg-ivory-deep text-ink' : 'hover:bg-ivory-deep/60'
                    }`}
                  >
                    <ThumbsDownOutlineIcon size={15} />
                  </button>
                </div>
              </li>
            ),
          )}

          {chat.isPending && (
            <li className="text-sm text-ink-muted">bAI is typing…</li>
          )}
          <div ref={endRef} />
        </ol>

        {chat.isError && <ErrorMessage error={chat.error} />}
        {imageError && (
          <p role="alert" className="mt-3 rounded-2xl border border-danger-line bg-danger-soft p-3 text-xs font-semibold text-danger">
            {imageError}
          </p>
        )}
      </div>

      {/* Clean White Floating Bottom Composer Card (Image 7) */}
      <div
        className="sticky bottom-0 z-10 bg-linear-to-t from-ivory via-ivory to-transparent px-4 pt-3"
        style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
      >
        <div className="-mx-4 mb-2.5 flex gap-2 overflow-x-auto px-4">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className={`min-h-12 shrink-0 rounded-full border border-ivory-line bg-ivory-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-ivory-deep ${focus}`}
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={send}
          className="rounded-3xl border border-ivory-line bg-ivory-surface p-3 shadow-md"
        >
          {attachedImage && (
            <div className="mb-2 flex items-center gap-2.5 rounded-2xl bg-ivory-deep p-2">
              <img src={attachedImage.preview} alt="Selected attachment" className="size-10 rounded-xl object-cover" />
              <span className="flex-1 truncate text-xs font-medium text-ink">Photo ready to send</span>
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="px-2 text-xs font-bold text-ink"
              >
                Remove
              </button>
            </div>
          )}

          <label className="sr-only" htmlFor="chat-input">
            Message
          </label>
          <input
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={2000}
            placeholder="Ask about this place…"
            className="w-full bg-transparent px-2 py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                aria-label="Take a photo to ask bAI"
                className={`touch-target flex items-center justify-center rounded-full text-ink transition-colors hover:bg-ivory-deep ${focus}`}
              >
                <CameraOutlineIcon size={20} />
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                aria-label="Upload an image to ask bAI"
                className={`touch-target flex items-center justify-center rounded-full text-ink transition-colors hover:bg-ivory-deep ${focus}`}
              >
                <AddOutlineIcon size={22} />
              </button>
            </div>

            <button
              type="submit"
              aria-label="Send"
              disabled={(!draft.trim() && !attachedImage) || chat.isPending}
              className={`touch-target flex items-center justify-center rounded-full transition-colors ${
                draft.trim() || attachedImage
                  ? 'bg-navy text-on-navy hover:bg-navy-pressed'
                  : 'bg-ivory-deep text-ink-muted'
              } disabled:opacity-60 ${focus}`}
            >
              <ArrowUpIcon size={20} />
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            capture="environment"
            className="hidden"
            onChange={onAttachPhoto}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className="hidden"
            onChange={onAttachPhoto}
          />
        </form>
      </div>
    </div>
  )
}

function IconButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`touch-target flex items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ivory-deep hover:text-ink ${focus}`}
    >
      {icon}
    </button>
  )
}
