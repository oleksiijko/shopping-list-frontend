import { useState, useEffect } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import styles from './ItemForm.module.css'

export interface ItemFormValues {
  name: string
  price: number
  description: string
}

interface ItemFormProps {
  initialValues: ItemFormValues
  onSubmit: (values: ItemFormValues) => void
  submitLabel: string
  loading: boolean
  errorText?: string
}

export function ItemForm({
  initialValues,
  onSubmit,
  submitLabel,
  loading,
  errorText,
}: ItemFormProps) {
  const [name, setName] = useState(initialValues.name)
  const [price, setPrice] = useState(
    initialValues.price === 0 ? '' : String(initialValues.price)
  )
  const [description, setDescription] = useState(initialValues.description)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setName(initialValues.name)
    setPrice(initialValues.price === 0 ? '' : String(initialValues.price))
    setDescription(initialValues.description)
  }, [initialValues.name, initialValues.price, initialValues.description])

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

    onSubmit({
      name: nameTrimmed,
      price: priceNum,
      description: description.trim(),
    })
  }

  const displayError = validationError ?? errorText

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {displayError && <p className={styles.error}>{displayError}</p>}
      <div className={styles.rowFields}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Name"
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
            disabled={loading}
            placeholder="Price"
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          placeholder="Description"
          rows={3}
          className={styles.descriptionInput}
        />
      </div>
      <div className={styles.submitRow}>
        <button type="submit" disabled={loading} className={styles.submitButton} aria-label={submitLabel}>
          <FaPaperPlane />
        </button>
      </div>
    </form>
  )
}
