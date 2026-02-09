import { Route, Routes } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditItemPage } from './EditItemPage'
import { renderWithProviders, createDeferred } from '../test/test-utils'
import { getItem, updateItem } from '../api/items'

vi.mock('../api/items', () => ({
  getItem: vi.fn(),
  updateItem: vi.fn(),
}))

function renderEditPage(path = '/items/1/edit') {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<div>Home Screen</div>} />
      <Route path="/items/:id/edit" element={<EditItemPage />} />
    </Routes>,
    { initialEntries: [path] }
  )
}

describe('EditItemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows invalid id for malformed route param', () => {
    renderEditPage('/items/abc/edit')

    expect(screen.getByText('Invalid item ID')).toBeInTheDocument()
  })

  it('shows loading while item query pending', () => {
    const deferred = createDeferred<{
      id: number
      name: string
      price: number
      description: string
    }>()
    vi.mocked(getItem).mockReturnValue(deferred.promise)

    renderEditPage('/items/2/edit')

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows query error', async () => {
    vi.mocked(getItem).mockRejectedValue(new Error('Load failed'))

    renderEditPage('/items/2/edit')

    await waitFor(() => {
      expect(screen.getByText('Error: Load failed')).toBeInTheDocument()
    })
  })

  it('submits update and navigates home', async () => {
    const user = userEvent.setup()

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

    renderEditPage('/items/2/edit')

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
      expect(screen.getByText('Home Screen')).toBeInTheDocument()
    })
  })
})
