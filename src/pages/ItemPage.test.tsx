import { Route, Routes } from 'react-router-dom'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ItemPage } from './ItemPage'
import { renderWithProviders, createDeferred } from '../test/test-utils'
import { getItem } from '../api/items'

vi.mock('../api/items', () => ({
  getItem: vi.fn(),
}))

function renderItemPage(path = '/items/1') {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<div>Home Screen</div>} />
      <Route path="/items/:id" element={<ItemPage />} />
    </Routes>,
    { initialEntries: [path] }
  )
}

describe('ItemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows invalid id message', () => {
    renderItemPage('/items/abc')

    expect(screen.getByText('Invalid item ID')).toBeInTheDocument()
  })

  it('shows loading while query pending', () => {
    const deferred = createDeferred<{
      id: number
      name: string
      price: number
      description: string
    }>()
    vi.mocked(getItem).mockReturnValue(deferred.promise)

    renderItemPage('/items/3')

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows query error', async () => {
    vi.mocked(getItem).mockRejectedValue(new Error('Not found'))

    renderItemPage('/items/3')

    await waitFor(() => {
      expect(screen.getByText('Error: Not found')).toBeInTheDocument()
    })
  })

  it('renders item details and back link', async () => {
    vi.mocked(getItem).mockResolvedValue({
      id: 3,
      name: 'Tomatos',
      price: 5,
      description: 'Fresh and red',
    })

    renderItemPage('/items/3')

    expect(await screen.findByRole('heading', { name: 'Tomatos' })).toBeInTheDocument()
    expect(screen.getByText('Fresh and red')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/')
  })

  it('shows em dash when description is empty', async () => {
    vi.mocked(getItem).mockResolvedValue({
      id: 4,
      name: 'Bread',
      price: 10,
      description: '',
    })

    renderItemPage('/items/4')

    expect(await screen.findByRole('heading', { name: 'Bread' })).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
