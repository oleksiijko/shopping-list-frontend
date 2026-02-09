import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { IconBack } from '../components/Icons'
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
      <Link to="/" className={styles.backArrow} aria-label="Back">
        <IconBack />
      </Link>
      <h1 className={styles.title}>{item.name}</h1>
      <p className={styles.description}>{item.description || '—'}</p>
      <div className={styles.divider} />
    </div>
  )
}
