import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router'
import Markdown from 'react-markdown'
import { answerAboutLandmark, DEMO_LANDMARKS } from '@/api/demoData'
import { useChat, useScan } from '@/api/hooks'
import type { Landmark, ScanResult } from '@/api/types'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  CameraOutlineIcon,
  CameraReverseOutlineIcon,
  ImageOutlineIcon,
  LanguageOutlineIcon,
  LocationOutlineIcon,
  ScanOutlineIcon,
  StarIcon,
} from '@/components/icons/ionicons'
import { LandmarkRow } from '@/components/LandmarkCard'
import { ErrorMessage } from '@/components/StateMessage'
import { useGeolocation } from '@/hooks/useGeolocation'
import { CATEGORY_LABELS, formatFee } from '@/lib/format'
import { ACCEPTED_IMAGE_TYPES, validateImage } from '@/lib/image'

const STATUS_COPY: Record<Exclude<ScanResult['status'], 'identified'>, string> = {
  low_confidence: "I'm not quite sure what this is. Try again with the whole structure in frame and good light.",
  not_nearby: "That looks like a landmark that isn't near you. Are you at one of these places instead?",
  unrecognized: "I couldn't recognize this landmark. Retake the photo straight on, or pick a place below.",
}

type LensTab = 'ai' | 'all' | 'history' | 'nearby'

const QUICK_QUESTIONS = [
  'Where is this place?',
  "What's the history here?",
  'Admission & hours?',
  "What's nearby?",
]

const SAMPLE_SPOTS = DEMO_LANDMARKS.slice(0, 5)
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'

type CameraState = 'starting' | 'ready' | 'unavailable'

const hasLiveCamera = () => typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function'

/**
 * Google Lens-style visual AI scanner & multimodal Q&A (Image 5).
 * Top lagoon-teal live camera viewfinder with white reticle + pull-up bottom sheet.
 */
export default function ScanPage() {
  const geo = useGeolocation()
  const scan = useScan()
  const chat = useChat()
  const cameraInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [cameraState, setCameraState] = useState<CameraState>(() =>
    hasLiveCamera() ? 'starting' : 'unavailable',
  )
  const [validationError, setValidationError] = useState<string | null>(null)
  const [sampleMatch, setSampleMatch] = useState<{ landmark: Landmark; confidence: number } | null>(null)
  const [activeTab, setActiveTab] = useState<LensTab>('ai')
  const [questionDraft, setQuestionDraft] = useState('')
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [cebuanoMode, setCebuanoMode] = useState(false)

  const activeLandmark: Landmark | null =
    scan.data?.status === 'identified' && scan.data.landmark ? scan.data.landmark : sampleMatch?.landmark ?? null
  const activeConfidence =
    scan.data?.status === 'identified' && scan.data.landmark ? scan.data.confidence : sampleMatch?.confidence ?? null

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    if (preview !== null || !hasLiveCamera()) {
      stopCameraStream()
      return
    }

    let cancelled = false

    const startCamera = async () => {
      let stream: MediaStream
      try {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
          })
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        }
      } catch {
        if (!cancelled) setCameraState('unavailable')
        return
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        void videoRef.current.play?.().catch(() => {})
      }
      setCameraState('ready')
    }

    void startCamera()

    return () => {
      cancelled = true
      stopCameraStream()
    }
  }, [preview, facingMode, stopCameraStream])

  const resetConversation = () => {
    setAskedQuestion(null)
    setAiAnswer(null)
    chat.reset()
  }

  const processScannedFile = async (file: File) => {
    setValidationError(null)
    setSampleMatch(null)
    resetConversation()
    scan.reset()
    const check = await validateImage(file)
    if (!check.ok) {
      setValidationError(check.reason)
      return
    }
    stopCameraStream()
    setPreview((old) => {
      if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
      return URL.createObjectURL(file)
    })
    scan.mutate(
      { image: file, lat: geo.coords?.lat, lng: geo.coords?.lng },
      {
        onSuccess: (result) => {
          if (result.status === 'identified' && result.landmark) {
            setActiveTab('ai')
            setAskedQuestion('Where is this place?')
            setAiAnswer(answerAboutLandmark(result.landmark, 'Where is this place?'))
          }
        },
      },
    )
  }

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    await processScannedFile(file)
  }

  const openLiveCamera = () => {
    setValidationError(null)
    setSampleMatch(null)
    setCameraState(hasLiveCamera() ? 'starting' : 'unavailable')
    setPreview((old) => {
      if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
      return null
    })
  }

  const handleTakePhoto = async () => {
    if (preview !== null) {
      if (hasLiveCamera()) {
        openLiveCamera()
      } else {
        cameraInput.current?.click()
      }
      return
    }

    if (cameraState === 'unavailable') {
      cameraInput.current?.click()
      return
    }

    if (cameraState !== 'ready' || !videoRef.current) return

    const video = videoRef.current
    const rawW = video.videoWidth || 1280
    const rawH = video.videoHeight || 720
    const scale = Math.max(1, 720 / Math.min(rawW, rawH), 1280 / Math.max(rawW, rawH))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(rawW * scale)
    canvas.height = Math.round(rawH * scale)

    const ctx = canvas.getContext('2d')
    let blob: Blob | null = null
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      blob = await new Promise<Blob | null>((resolve) => {
        if (typeof canvas.toBlob === 'function') {
          canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.92)
        } else {
          resolve(null)
        }
      })
      if (!blob) {
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
          const base64 = dataUrl.split(',')[1]
          if (base64) {
            const binary = atob(base64)
            const bytes = new Uint8Array(binary.length)
            for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
            blob = new Blob([bytes], { type: 'image/jpeg' })
          }
        } catch {
          blob = null
        }
      }
    }

    const capturedFile = new File([blob ?? new Uint8Array(1024)], 'magellan-camera-scan.jpg', {
      type: 'image/jpeg',
    })
    await processScannedFile(capturedFile)
  }

  const selectSampleSpot = (landmark: Landmark) => {
    setValidationError(null)
    scan.reset()
    resetConversation()
    stopCameraStream()
    setPreview((old) => {
      if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
      return landmark.imageUrl
    })
    setSampleMatch({ landmark, confidence: 0.97 })
    setActiveTab('ai')
    setAskedQuestion('Where is this place?')
    setAiAnswer(answerAboutLandmark(landmark, 'Where is this place?'))
  }

  const askAboutImage = (rawQuestion: string) => {
    const text = rawQuestion.trim()
    if (!text) return
    if (!activeLandmark) {
      setValidationError('Take a photo, upload an image, or pick a Cebu spot above first.')
      return
    }
    setValidationError(null)
    setAskedQuestion(text)
    setQuestionDraft('')
    setActiveTab('ai')
    chat.mutate(
      { landmarkId: activeLandmark.id, messages: [{ role: 'user', content: text }] },
      {
        onSuccess: (res) => setAiAnswer(res.message.content),
        onError: () => setAiAnswer(answerAboutLandmark(activeLandmark, text)),
      },
    )
  }

  const onSubmitQuestion = (event: FormEvent) => {
    event.preventDefault()
    askAboutImage(questionDraft)
  }

  const result = scan.data
  const displayOverview =
    aiAnswer ?? (activeLandmark ? answerAboutLandmark(activeLandmark, 'Where is this place?') : null)

  return (
    <div className="bleed-under-nav flex min-h-dvh flex-col bg-ivory text-ink">
      {/* Tropical Lagoon Lens camera viewport */}
      <section data-palette="light" className="relative bg-linear-to-b from-[#07363c] via-navy to-[#094249] pt-[max(0.75rem,env(safe-area-inset-top))] pb-10 text-white">
        <header className="flex items-center justify-between gap-2 px-4 pb-3">
          <Link
            to="/"
            aria-label="Back to Explore"
            className="touch-target flex items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowBackIcon size={20} />
          </Link>

          <h1 className="text-base font-semibold tracking-tight text-white">
            Laag ta bAI <span className="font-display text-lg font-normal italic text-terracotta-light">Lens</span>
          </h1>

          <button
            type="button"
            onClick={geo.request}
            aria-label={geo.status === 'ready' ? 'Location active' : 'Enable location verification'}
            className={`touch-target flex items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors ${
              geo.status === 'ready' ? 'bg-sage-soft text-sage-deep' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <LocationOutlineIcon size={15} />
            <span className="hidden min-[360px]:inline">GPS</span>
          </button>
        </header>

        {/* Built-In Live Camera / Image Frame with Lens Framing Brackets */}
        <div className="relative mx-4 aspect-[4/3.4] overflow-hidden rounded-3xl bg-[#06252a] ring-1 ring-white/15">
          {preview ? (
            <>
              <img src={preview} alt="Your scanned landmark" className="size-full object-cover" />
              <button
                type="button"
                onClick={openLiveCamera}
                className="touch-target absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-ivory-surface/95 px-3.5 text-xs font-bold text-navy shadow-md backdrop-blur-sm transition-transform active:scale-95"
              >
                <CameraOutlineIcon size={15} />
                Live camera
              </button>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                data-testid="live-camera-video"
                aria-label="Built-in camera viewfinder"
                className="size-full object-cover"
              />

              {cameraState === 'ready' && (
                <>
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-navy/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                    Live Camera
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCameraState('starting')
                      setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))
                    }}
                    aria-label="Switch camera"
                    className="touch-target absolute top-2 right-2 z-10 flex size-12 items-center justify-center rounded-full bg-navy/80 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-navy"
                  >
                    <CameraReverseOutlineIcon size={20} />
                  </button>
                </>
              )}

              {cameraState === 'starting' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#06252a]/75 p-6 text-center backdrop-blur-[1px]">
                  <ScanOutlineIcon size={32} className="animate-pulse text-terracotta-light" />
                  <p className="text-sm font-medium text-white">Starting built-in camera…</p>
                </div>
              )}

              {cameraState === 'unavailable' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src="/landmarks/magellan.jpg"
                    alt=""
                    aria-hidden
                    className="absolute inset-0 size-full object-cover opacity-35"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <ScanOutlineIcon size={32} className="text-terracotta-light" />
                    <p className="max-w-xs text-sm font-medium text-white">
                      Built-in camera unavailable — upload a photo or pick a Cebu spot below.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* White corner brackets framing the focal subject */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden>
            <div className={`relative size-44 sm:size-52 ${scan.isPending ? 'animate-pulse' : ''}`}>
              <span className="absolute top-0 left-0 size-6 rounded-tl-xl border-t-3 border-l-3 border-white/95" />
              <span className="absolute top-0 right-0 size-6 rounded-tr-xl border-t-3 border-r-3 border-white/95" />
              <span className="absolute bottom-0 left-0 size-6 rounded-bl-xl border-b-3 border-l-3 border-white/95" />
              <span className="absolute right-0 bottom-0 size-6 rounded-br-xl border-r-3 border-b-3 border-white/95" />
            </div>
          </div>

          {scan.isPending && (
            <div
              role="status"
              className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-navy/70 backdrop-blur-[2px]"
            >
              <span className="size-7 animate-spin rounded-full border-3 border-white/30 border-t-white" aria-hidden />
              <p className="text-sm font-semibold text-white">Identifying landmark…</p>
            </div>
          )}

          <div className="absolute right-3 bottom-3 z-10">
            <button
              type="button"
              onClick={() => setCebuanoMode((v) => !v)}
              aria-pressed={cebuanoMode}
              aria-label={cebuanoMode ? 'Switch AI notes to English' : 'Show Cebuano greeting mode'}
              className={`flex size-12 items-center justify-center rounded-full shadow-md transition-colors ${
                cebuanoMode ? 'bg-terracotta text-on-navy ring-2 ring-white' : 'bg-ivory-surface text-navy'
              }`}
            >
              <LanguageOutlineIcon size={19} />
            </button>
          </div>
        </div>

        {/* Capture & Upload Controls */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 px-4">
          <button
            type="button"
            onClick={handleTakePhoto}
            className="touch-target flex items-center justify-center gap-2 rounded-full bg-terracotta px-4 text-sm font-bold text-on-navy shadow-md transition-transform hover:bg-terracotta-ink active:scale-95"
          >
            <CameraOutlineIcon size={18} />
            Take photo
          </button>
          <button
            type="button"
            onClick={() => galleryInput.current?.click()}
            className="touch-target flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 text-sm font-bold text-white transition-colors hover:bg-white/25"
          >
            <ImageOutlineIcon size={18} />
            Upload
          </button>
        </div>

        <input
          ref={cameraInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          capture="environment"
          className="hidden"
          onChange={onFile}
          data-testid="camera-input"
        />
        <input
          ref={galleryInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className="hidden"
          onChange={onFile}
          data-testid="gallery-input"
        />

        {/* Sample Cebu spots for quick testing */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1">
          <span className="shrink-0 text-xs font-medium text-white/75">Try:</span>
          {SAMPLE_SPOTS.map((spot) => {
            const selected = activeLandmark?.id === spot.id && sampleMatch !== null
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => selectSampleSpot(spot)}
                className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full px-2.5 py-1 pr-3 text-xs font-medium transition-colors ${
                  selected ? 'bg-sage-soft text-sage-deep' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <img src={spot.imageUrl ?? ''} alt="" className="size-6 rounded-full object-cover" />
                <span className="whitespace-nowrap">{spot.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Pure White Pull-Up Google Lens Bottom Sheet (Image 5) */}
      <section className="relative z-10 -mt-5 flex flex-1 flex-col gap-4 rounded-t-[1.75rem] bg-ivory-surface px-5 pt-3 pb-8">
        <div className="mx-auto h-1 w-9 rounded-full bg-ivory-line" aria-hidden />

        {/* "Ask about this image" Light-Gray Pill Input */}
        <form onSubmit={onSubmitQuestion}>
          <div className="flex min-h-13 items-center gap-2.5 rounded-full bg-ivory-deep p-1.5 pl-2.5 focus-within:outline-2 focus-within:outline-navy">
            {preview ? (
              <img src={preview} alt="" className="size-8 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ivory-surface text-ink">
                <CameraOutlineIcon size={16} />
              </span>
            )}
            <label htmlFor="lens-question-input" className="sr-only">
              Ask about this image
            </label>
            <input
              id="lens-question-input"
              type="text"
              value={questionDraft}
              onChange={(e) => setQuestionDraft(e.target.value)}
              placeholder="Ask about this image"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              aria-label="Ask AI about this image"
              disabled={!questionDraft.trim() || chat.isPending}
              className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-on-navy transition-colors hover:bg-navy-pressed disabled:opacity-35 ${focus}`}
            >
              <ArrowUpIcon size={17} />
            </button>
          </div>
        </form>

        {/* Quick Question Chips */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => askAboutImage(q)}
              className={`min-h-12 shrink-0 rounded-full border border-ivory-line bg-ivory-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-ivory-deep ${focus}`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Clean Underline Tabs (Image 5: AI Mode | All | History | Nearby) */}
        <div className="flex items-center gap-6 border-b border-ivory-line text-sm" role="tablist" aria-label="Lens result views">
          {(
            [
              ['ai', 'AI Mode'],
              ['all', 'All'],
              ['history', 'History'],
              ['nearby', 'Nearby'],
            ] as const
          ).map(([id, label]) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(id)}
                className={`min-h-12 border-b-2 pb-1 text-sm transition-colors ${focus} ${
                  active ? 'border-navy font-bold text-ink' : 'border-transparent font-medium text-ink-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {validationError && (
          <p role="alert" className="rounded-2xl border border-danger-line bg-danger-soft p-3.5 text-sm font-medium text-danger">
            {validationError}
          </p>
        )}
        {scan.isError && <ErrorMessage error={scan.error} />}

        {/* Unrecognized / Low Confidence Fallback */}
        {result && result.status !== 'identified' && (
          <div className="space-y-3" aria-live="polite">
            <p className="text-sm text-ink-body">{STATUS_COPY[result.status]}</p>
            {result.candidates.length > 0 ? (
              <>
                <h2 className="text-base font-bold text-ink">Closest landmarks</h2>
                <div className="space-y-2.5">
                  {result.candidates.map((l) => (
                    <LandmarkRow key={l.id} landmark={l} />
                  ))}
                </div>
              </>
            ) : (
              <Link to="/" className="block text-center text-sm font-bold text-ink underline">
                Browse landmarks instead
              </Link>
            )}
          </div>
        )}

        {/* Clean AI Overview Answer (Image 5) */}
        {activeLandmark && displayOverview ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-ink">AI Overview</h2>
              {activeConfidence !== null && (
                <span className="font-mono text-xs font-medium text-ink-muted">
                  {Math.round(activeConfidence * 100)}% match
                </span>
              )}
            </div>

            {askedQuestion && (
              <p className="text-xs font-semibold text-ink-muted">
                Asked: “{askedQuestion}”
              </p>
            )}

            {cebuanoMode && (
              <p className="rounded-xl border border-terracotta/25 bg-terracotta-soft px-3.5 py-2.5 text-xs font-medium text-ink">
                Maayong adlaw, bai! Mao ni ang <strong>{activeLandmark.name}</strong> sa {activeLandmark.district}.
              </p>
            )}

            {chat.isPending ? (
              <div className="space-y-2 py-2" role="status">
                <div className="h-4 w-5/6 animate-pulse rounded bg-ivory-deep" />
                <div className="h-4 w-full animate-pulse rounded bg-ivory-deep" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-ivory-deep" />
              </div>
            ) : activeTab === 'history' ? (
              <div className="space-y-3 text-sm leading-6 text-ink-body">
                <p>{activeLandmark.story.significance}</p>
                <p>{activeLandmark.story.architecture}</p>
              </div>
            ) : activeTab === 'nearby' ? (
              <div className="space-y-2.5">
                {DEMO_LANDMARKS.filter((l) => l.id !== activeLandmark.id)
                  .slice(0, 3)
                  .map((l) => (
                    <LandmarkRow key={l.id} landmark={l} />
                  ))}
              </div>
            ) : (
              <div className="markdown text-sm leading-6 text-ink-body">
                <Markdown>{displayOverview}</Markdown>
              </div>
            )}

            {/* Clean Matched Landmark Row & Links */}
            <div className="mt-1 flex flex-col gap-3 border-t border-ivory-line pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeLandmark.imageUrl ?? ''}
                  alt={activeLandmark.name}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display truncate text-base font-bold text-ink">{activeLandmark.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-0.5 font-mono font-bold text-ink">
                      <StarIcon size={11} className="text-terracotta" /> {activeLandmark.rating.toFixed(1)}
                    </span>
                    <span>· {CATEGORY_LABELS[activeLandmark.category]}</span>
                    <span className="font-mono">· {formatFee(activeLandmark.admissionFee)}</span>
                    <span>· {activeLandmark.district}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to={`/landmarks/${activeLandmark.id}`}
                  state={activeConfidence ? { confidence: activeConfidence } : undefined}
                  className={`flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-navy px-4 text-xs font-bold text-on-navy transition-colors hover:bg-navy-pressed ${focus}`}
                >
                  Open full story
                  <ArrowForwardIcon size={14} />
                </Link>
                <Link
                  to={`/landmarks/${activeLandmark.id}/chat`}
                  className={`flex min-h-12 items-center justify-center rounded-full border border-ivory-line bg-ivory-surface px-4 text-xs font-bold text-ink transition-colors hover:bg-ivory-deep ${focus}`}
                >
                  Ask follow-up
                </Link>
              </div>
            </div>
          </div>
        ) : (
          !scan.isPending && (
            <div className="space-y-1.5 py-2">
              <h2 className="font-display text-xl font-bold text-ink">AI Overview</h2>
              <p className="text-sm leading-6 text-ink-body">
                Take a photo, upload an image, or pick a Cebu spot above, then ask where it is or what to see there.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  )
}
