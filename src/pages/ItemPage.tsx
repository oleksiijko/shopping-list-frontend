import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getItem } from '../api/items'
import styles from './ItemPage.module.css'

export function ItemPage() {
  const { id } = useParams()
  const idNum = id ? parseInt(id, 10) : NaN
  const isValidId = !Number.isNaN(idNum) && idNum >= 1

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['items', idNum],
    queryFn: () => getItem(idNum),
    enabled: isValidId,
  })

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
      <div className={styles.links}>
        <Link to="/" className={styles.backLink}>
          Back
        </Link>
        <Link to={`/items/${item.id}/edit`} className={styles.editLink}>
          Edit
        </Link>
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
