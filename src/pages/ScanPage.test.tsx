import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DEMO_LANDMARKS } from '@/api/demoData'
import { mockFetch, renderPage } from '@/test/render'
import ScanPage from './ScanPage'

describe('ScanPage', () => {
  it('identifies a Cebu sample spot and answers custom questions in the AI Overview sheet', async () => {
    const user = userEvent.setup()
    mockFetch((_url, init) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {}
      const question = body.messages?.[0]?.content ?? ''
      return {
        data: {
          message: {
            role: 'model',
            content: question.includes('hours')
              ? "Magellan's Cross is open 8:00 AM - 6:00 PM daily."
              : "This is Magellan's Cross in Downtown Cebu City.",
          },
          progress: null,
        },
      }
    })

    renderPage(<ScanPage />, '/scan')

    expect(await screen.findByRole('heading', { name: /Laag ta bAI Lens/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Take photo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: "Magellan's Cross" }))
    expect(await screen.findByText(/97% match/i)).toBeInTheDocument()
    expect(screen.getByText(/Downtown Cebu City, Cebu City/)).toBeInTheDocument()

    const input = screen.getByLabelText('Ask about this image')
    await user.type(input, 'What are the hours?')
    await user.click(screen.getByRole('button', { name: 'Ask AI about this image' }))

    expect(await screen.findByText(/open 8:00 AM - 6:00 PM daily/i)).toBeInTheDocument()
  })

  it('shows a validation alert when an unsupported file type is uploaded', async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderPage(<ScanPage />, '/scan')

    const galleryInput = (await screen.findByTestId('gallery-input')) as HTMLInputElement
    const badFile = new File(['hello'], 'notes.txt', { type: 'text/plain' })
    await user.upload(galleryInput, badFile)

    expect(await screen.findByRole('alert')).toHaveTextContent('Use a JPEG, PNG or HEIC photo.')
  })

  it('auto-starts the built-in camera on mount and captures directly without opening a file picker', async () => {
    const user = userEvent.setup()
    const stopTrack = vi.fn()
    const fakeStream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(fakeStream)

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia },
    })
    const playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:captured-frame')
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const fetchSpy = mockFetch((url) => {
      if (url.pathname.endsWith('/v1/scan')) {
        return {
          data: {
            status: 'identified',
            confidence: 0.96,
            landmark: DEMO_LANDMARKS[0],
            candidates: [],
            progress: null,
          },
        }
      }
      return { data: {} }
    })

    try {
      renderPage(<ScanPage />, '/scan')

      const video = (await screen.findByTestId('live-camera-video')) as HTMLVideoElement
      expect(await screen.findByText('Live Camera')).toBeInTheDocument()
      expect(getUserMedia).toHaveBeenCalledTimes(1)
      expect(video.srcObject).toBe(fakeStream)
      expect(playSpy).toHaveBeenCalled()

      const cameraInput = screen.getByTestId('camera-input') as HTMLInputElement
      const cameraInputClick = vi.spyOn(cameraInput, 'click')

      await user.click(screen.getByRole('button', { name: 'Take photo' }))

      expect(cameraInputClick).not.toHaveBeenCalled()
      expect(await screen.findByText(/96% match/i)).toBeInTheDocument()
      expect(screen.getByText(/Downtown Cebu City, Cebu City/)).toBeInTheDocument()
      expect(screen.getAllByText("Magellan's Cross").length).toBeGreaterThanOrEqual(2)

      const scanCall = fetchSpy.mock.calls.find(([input]) => String(input).includes('/v1/scan'))
      expect(scanCall).toBeDefined()
      expect(scanCall?.[1]?.method).toBe('POST')
      expect(stopTrack).toHaveBeenCalled()
    } finally {
      createObjectUrlSpy.mockRestore()
      revokeObjectUrlSpy.mockRestore()
      delete (navigator as { mediaDevices?: unknown }).mediaDevices
    }
  })
})
