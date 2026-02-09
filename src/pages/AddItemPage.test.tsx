import { Route, Routes } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AddItemPage } from './AddItemPage'
import { renderWithProviders } from '../test/test-utils'
import { createItem } from '../api/items'

vi.mock('../api/items', () => ({
  createItem: vi.fn(),
}))

function renderAddPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<div>Home Screen</div>} />
      <Route path="/items/new" element={<AddItemPage />} />
    </Routes>,
    { initialEntries: ['/items/new'] }
  )
}

describe('AddItemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('navigates home when close clicked', async () => {
    const user = userEvent.setup()
    renderAddPage()

    await user.click(screen.getByRole('link', { name: 'Close' }))

    expect(screen.getByText('Home Screen')).toBeInTheDocument()
  })

  it('submits values and navigates home on success', async () => {
    const user = userEvent.setup()

    vi.mocked(createItem).mockResolvedValue({
      id: 1,
      name: 'Milk',
      price: 8,
      description: '1L',
    })

    renderAddPage()

    await user.type(screen.getByLabelText('Name'), 'Milk')
    await user.type(screen.getByLabelText('Price'), '8')
    await user.type(screen.getByLabelText('Description'), '1L')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(createItem).toHaveBeenCalled()
    })

    expect(vi.mocked(createItem).mock.calls[0][0]).toEqual({
      name: 'Milk',
      price: 8,
      description: '1L',
    })

    await waitFor(() => {
      expect(screen.getByText('Home Screen')).toBeInTheDocument()
    })
  })

  it('shows mutation error', async () => {
    const user = userEvent.setup()

    vi.mocked(createItem).mockRejectedValue(new Error('Create failed'))

    renderAddPage()

    await user.type(screen.getByLabelText('Name'), 'Milk')
    await user.type(screen.getByLabelText('Price'), '8')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Create failed')).toBeInTheDocument()
    })
  })
})
