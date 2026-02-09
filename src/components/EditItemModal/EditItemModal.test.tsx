import { Routes, Route } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditItemModal } from './EditItemModal'
import { renderWithProviders, createDeferred } from '../../test/test-utils'
import { getItem, updateItem } from '../../api/items'

vi.mock('../../api/items', () => ({
  getItem: vi.fn(),
  updateItem: vi.fn(),
}))

function renderEditModal(path = '/items/1/edit', onClose = vi.fn()) {
  return renderWithProviders(
    <Routes>
      <Route path="/items/:id/edit" element={<EditItemModal onClose={onClose} />} />
    </Routes>,
    { initialEntries: [path] }
  )
}

describe('EditItemModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows invalid id message', () => {
    const onClose = vi.fn()

    renderEditModal('/items/abc/edit', onClose)

    expect(screen.getByText('Invalid item ID')).toBeInTheDocument()
  })

  it('shows loading state while item query pending', () => {
    const deferred = createDeferred<{
      id: number
      name: string
      price: number
      description: string
    }>()
    vi.mocked(getItem).mockReturnValue(deferred.promise)

    renderEditModal('/items/2/edit')

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows query error', async () => {
    vi.mocked(getItem).mockRejectedValue(new Error('Fetch failed'))

    renderEditModal('/items/2/edit')

    await waitFor(() => {
      expect(screen.getByText('Error: Fetch failed')).toBeInTheDocument()
    })
  })

  it('submits updated values and closes on success', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    vi.mocked(getItem).mockResolvedValue({
      id: 2,
      name: 'Bread',
      price: 10,
      description: 'Old',
    })
    vi.mocked(updateItem).mockResolvedValue({
      id: 2,
      name: 'Bread',
      price: 12,
      description: 'Updated',
    })

    renderEditModal('/items/2/edit', onClose)

    await screen.findByDisplayValue('Bread')

    await user.clear(screen.getByLabelText('Price'))
    await user.type(screen.getByLabelText('Price'), '12')
    await user.clear(screen.getByLabelText('Description'))
    await user.type(screen.getByLabelText('Description'), 'Updated')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(updateItem).toHaveBeenCalledWith(2, {
        name: 'Bread',
        price: 12,
        description: 'Updated',
      })
    })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
