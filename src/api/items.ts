export interface Item {
  id: number
  name: string
  price: number
  description: string
}

const API_BASE = '/api'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || res.statusText)
  }
  return res.json()
}

export async function listItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`)
  const data = await handleResponse<{ items: Item[] }>(res)
  return data.items
}

export async function getItem(id: number): Promise<Item> {
  const res = await fetch(`${API_BASE}/items/${id}`)
  const data = await handleResponse<{ item: Item }>(res)
  return data.item
}

export interface CreateItemInput {
  name: string
  price: number
  description?: string
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name,
      price: input.price,
      description: input.description ?? '',
    }),
  })
  const data = await handleResponse<{ item: Item }>(res)
  return data.item
}

export interface UpdateItemInput {
  name?: string
  price?: number
  description?: string
}

export async function updateItem(id: number, input: UpdateItemInput): Promise<Item> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await handleResponse<{ item: Item }>(res)
  return data.item
}

export async function removeItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' })
  await handleResponse<{ message: string }>(res)
}
