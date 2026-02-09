import { Route, Routes } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListPage } from './ListPage'
import { renderWithProviders, createDeferred } from '../test/test-utils'
import { listItems, removeItem } from '../api/items'

vi.mock('../api/items', () => ({
  listItems: vi.fn(),
  removeItem: vi.fn(),
}))

function renderListPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/items/new" element={<div>Add Screen</div>} />
      <Route path="/items/:id/edit" element={<div>Edit Screen</div>} />
      <Route path="/items/:id" element={<div>Item Screen</div>} />
    </Routes>
  )
}

describe('ListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('shows loading state while list query pending', () => {
    const deferred = createDeferred<Array<{ id: number; name: string; price: number; description: string }>>()
    vi.mocked(listItems).mockReturnValue(deferred.promise)

    renderListPage()

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders items and computed total', async () => {
    vi.mocked(listItems).mockResolvedValue([
      { id: 1, name: 'Tomatos', price: 5, description: '' },
      { id: 2, name: 'Bread', price: 10, description: '' },
    ])

    renderListPage()

    expect(await screen.findByText('Tomatos')).toBeInTheDocument()
    expect(screen.getByText('Bread')).toBeInTheDocument()
    expect(screen.getByText('15 NIS')).toBeInTheDocument()
  })

  it('navigates to add page', async () => {
    const user = userEvent.setup()

    vi.mocked(listItems).mockResolvedValue([
      { id: 1, name: 'Tomatos', price: 5, description: '' },
    ])

    renderListPage()
    await screen.findByText('Tomatos')

    await user.click(screen.getByRole('button', { name: 'Add Product' }))
    expect(screen.getByText('Add Screen')).toBeInTheDocument()
  })

  it('navigates to edit page', async () => {
    const user = userEvent.setup()

    vi.mocked(listItems).mockResolvedValue([
      { id: 1, name: 'Tomatos', price: 5, description: '' },
    ])

    renderListPage()
    await screen.findByText('Tomatos')

    await user.click(screen.getByLabelText('Edit item'))
    expect(screen.getByText('Edit Screen')).toBeInTheDocument()
  })

  it('calls removeItem when delete confirmed', async () => {
    const user = userEvent.setup()

    vi.mocked(listItems).mockResolvedValue([
      { id: 5, name: 'Milk', price: 8, description: '' },
    ])
    vi.mocked(removeItem).mockResolvedValue(undefined)

    renderListPage()
    await screen.findByText('Milk')

    await user.click(screen.getByLabelText('Delete item'))

    await waitFor(() => {
      expect(removeItem).toHaveBeenCalled()
    })

    expect(vi.mocked(removeItem).mock.calls[0][0]).toBe(5)
  })

  it('does not delete when confirm returns false', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    vi.mocked(listItems).mockResolvedValue([
      { id: 5, name: 'Milk', price: 8, description: '' },
    ])

    renderListPage()
    await screen.findByText('Milk')

    await user.click(screen.getByLabelText('Delete item'))

    expect(removeItem).not.toHaveBeenCalled()
  })

  it('shows query error', async () => {
    vi.mocked(listItems).mockRejectedValue(new Error('Load failed'))

    renderListPage()

    await waitFor(() => {
      expect(screen.getByText('Error: Load failed')).toBeInTheDocument()
    })
  })
})
