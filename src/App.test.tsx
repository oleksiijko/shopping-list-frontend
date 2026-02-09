import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./pages/ListPage', () => ({
  ListPage: () => <div>List Route</div>,
}))

vi.mock('./pages/AddItemPage', () => ({
  AddItemPage: () => <div>Add Route</div>,
}))

vi.mock('./pages/EditItemPage', () => ({
  EditItemPage: () => <div>Edit Route</div>,
}))

vi.mock('./pages/ItemPage', () => ({
  ItemPage: () => <div>Item Route</div>,
}))

describe('App routes', () => {
  it('renders list route at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('List Route')).toBeInTheDocument()
  })

  it('renders add route at /items/new', () => {
    render(
      <MemoryRouter initialEntries={['/items/new']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Add Route')).toBeInTheDocument()
  })

  it('renders edit route at /items/:id/edit', () => {
    render(
      <MemoryRouter initialEntries={['/items/5/edit']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Edit Route')).toBeInTheDocument()
  })

  it('renders item route at /items/:id', () => {
    render(
      <MemoryRouter initialEntries={['/items/5']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Item Route')).toBeInTheDocument()
  })
})
