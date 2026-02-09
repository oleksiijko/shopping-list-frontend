import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { AddItemModal } from './AddItemModal'
import { renderWithProviders } from '../../test/test-utils'
import { createItem } from '../../api/items'

vi.mock('../../api/items', () => ({
  createItem: vi.fn(),
}))

describe('AddItemModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('closes when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    vi.mocked(createItem).mockResolvedValue({
      id: 1,
      name: 'Milk',
      price: 8,
      description: '',
    })

    renderWithProviders(<AddItemModal onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('submits and closes on success', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    vi.mocked(createItem).mockResolvedValue({
      id: 2,
      name: 'Cucumbers',
      price: 3,
      description: 'fresh',
    })

    renderWithProviders(<AddItemModal onClose={onClose} />)

    await user.type(screen.getByLabelText('Name'), 'Cucumbers')
    await user.type(screen.getByLabelText('Price'), '3')
    await user.type(screen.getByLabelText('Description'), 'fresh')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(createItem).toHaveBeenCalled()
    })

    expect(vi.mocked(createItem).mock.calls[0][0]).toEqual({
      name: 'Cucumbers',
      price: 3,
      description: 'fresh',
    })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('shows mutation error text', async () => {
    const user = userEvent.setup()

    vi.mocked(createItem).mockRejectedValue(new Error('Create failed'))

    renderWithProviders(<AddItemModal onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('Name'), 'Bread')
    await user.type(screen.getByLabelText('Price'), '10')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Create failed')).toBeInTheDocument()
    })
  })
})
