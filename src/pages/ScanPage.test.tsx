import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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
})
