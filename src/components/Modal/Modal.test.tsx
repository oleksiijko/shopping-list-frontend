import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders children into portal', () => {
    render(
      <Modal onClose={vi.fn()}>
        <div>Modal Body</div>
      </Modal>
    )

    expect(screen.getByText('Modal Body')).toBeInTheDocument()
  })

  it('calls onClose on backdrop click but not content click', () => {
    const onClose = vi.fn()

    render(
      <Modal onClose={onClose}>
        <div>Modal Body</div>
      </Modal>
    )

    const body = screen.getByText('Modal Body')
    const content = body.parentElement as HTMLElement
    const backdrop = content.parentElement as HTMLElement

    fireEvent.click(content)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()

    render(
      <Modal onClose={onClose}>
        <div>Modal Body</div>
      </Modal>
    )

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
