import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { createItem } from '../api/items'
import styles from './AddItemPage.module.css'

export function AddItemPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    const nameTrimmed = name.trim()
    const priceNum = Number(price)

    if (!nameTrimmed) {
      setValidationError('Name is required')
      return
    }
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setValidationError('Price must be a number >= 0')
      return
    }

    mutation.mutate({
      name: nameTrimmed,
      price: priceNum,
      description: description.trim(),
    })
  }

  const errorMessage = validationError ?? (mutation.isError ? (mutation.error as Error).message : null)
  const isSubmitting = mutation.isPending

  return (
    <div className={styles.container}>
      <h1>Add Item</h1>
      <Link to="/" className={styles.backLink}>
        Back
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
