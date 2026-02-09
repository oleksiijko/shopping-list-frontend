import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ItemForm } from './ItemForm'

describe('ItemForm', () => {
  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ItemForm
        initialValues={{ name: '', price: 0, description: '' }}
        onSubmit={onSubmit}
        submitLabel="Save"
        loading={false}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when price is invalid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ItemForm
        initialValues={{ name: 'Milk', price: 0, description: '' }}
        onSubmit={onSubmit}
        submitLabel="Save"
        loading={false}
      />
    )

    await user.clear(screen.getByLabelText('Price'))
    await user.type(screen.getByLabelText('Price'), '-2')
    const form = screen.getByRole('button', { name: 'Save' }).closest('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)

    expect(screen.getByText('Price must be a number >= 0')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits trimmed values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <ItemForm
        initialValues={{ name: '', price: 0, description: '' }}
        onSubmit={onSubmit}
        submitLabel="Save"
        loading={false}
      />
    )

    await user.type(screen.getByLabelText('Name'), '  Cucumbers  ')
    await user.type(screen.getByLabelText('Price'), '3')
    await user.type(screen.getByLabelText('Description'), '  fresh  ')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Cucumbers',
      price: 3,
      description: 'fresh',
    })
  })

  it('syncs inputs when initialValues prop changes', () => {
    const { rerender } = render(
      <ItemForm
        initialValues={{ name: 'Bread', price: 10, description: 'White' }}
        onSubmit={vi.fn()}
        submitLabel="Save"
        loading={false}
      />
    )

    rerender(
      <ItemForm
        initialValues={{ name: 'Tomato', price: 5, description: 'Red' }}
        onSubmit={vi.fn()}
        submitLabel="Save"
        loading={false}
      />
    )

    expect(screen.getByLabelText('Name')).toHaveValue('Tomato')
    expect(screen.getByLabelText('Price')).toHaveValue(5)
    expect(screen.getByLabelText('Description')).toHaveValue('Red')
  })

  it('disables fields and submit while loading', () => {
    render(
      <ItemForm
        initialValues={{ name: 'Bread', price: 10, description: 'White' }}
        onSubmit={vi.fn()}
        submitLabel="Save"
        loading
      />
    )

    expect(screen.getByLabelText('Name')).toBeDisabled()
    expect(screen.getByLabelText('Price')).toBeDisabled()
    expect(screen.getByLabelText('Description')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
