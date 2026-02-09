import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createItem, listItems, removeItem } from './items'

const fetchMock = vi.fn()

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('items api', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('listItems returns items from /api/items', async () => {
    const expectedItems = [
      { id: 1, name: 'Tomatos', price: 5, description: '' },
      { id: 2, name: 'Bread', price: 10, description: '' },
    ]

    fetchMock.mockResolvedValue(jsonResponse({ items: expectedItems }))

    const result = await listItems()

    expect(fetchMock).toHaveBeenCalledWith('/api/items')
    expect(result).toEqual(expectedItems)
  })

  it('createItem sends POST payload and defaults empty description', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        item: { id: 3, name: 'Cucumbers', price: 3, description: '' },
      })
    )

    await createItem({ name: 'Cucumbers', price: 3 })

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/items')
    expect(options.method).toBe('POST')
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(options.body).toBe(
      JSON.stringify({ name: 'Cucumbers', price: 3, description: '' })
    )
  })

  it('listItems throws backend error message when request fails', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: 'Validation failed' }, { status: 400, statusText: 'Bad Request' })
    )

    await expect(listItems()).rejects.toThrow('Validation failed')
  })

  it('removeItem falls back to statusText when error body is not json', async () => {
    fetchMock.mockResolvedValue(
      new Response('Internal error', { status: 500, statusText: 'Server Error' })
    )

    await expect(removeItem(7)).rejects.toThrow('Server Error')
    expect(fetchMock).toHaveBeenCalledWith('/api/items/7', { method: 'DELETE' })
  })
})
