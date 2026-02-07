import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItem, removeItem } from '../api/items'
import styles from './ItemPage.module.css'

export function ItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const idNum = id ? parseInt(id, 10) : NaN
  const isValidId = !Number.isNaN(idNum) && idNum >= 1

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['items', idNum],
    queryFn: () => getItem(idNum),
    enabled: isValidId,
  })

  const deleteMutation = useMutation({
    mutationFn: removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/')
    },
  })

  const handleDelete = () => {
    if (!window.confirm('Delete item?')) return
    deleteMutation.mutate(idNum)
  }

  if (!isValidId) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Invalid item ID</p>
        <Link to="/" className={styles.backLink}>
          Back to list
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Error: {(error as Error).message}</p>
        <Link to="/" className={styles.backLink}>
          Back to list
        </Link>
      </div>
    )
  }

  if (!item) {
    return null
  }

  return (
    <div className={styles.container}>
      <h1>{item.name}</h1>
      {deleteMutation.isError && (
        <p className={styles.error}>
          Error: {(deleteMutation.error as Error).message}
        </p>
      )}
      <div className={styles.links}>
        <Link to="/" className={styles.backLink}>
          Back
        </Link>
        <Link to={`/items/${item.id}/edit`} className={styles.editLink}>
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
      <dl className={styles.details}>
        <dt>Price</dt>
        <dd>{item.price}</dd>
        <dt>Description</dt>
        <dd>{item.description || '—'}</dd>
      </dl>
    </div>
  )
}
