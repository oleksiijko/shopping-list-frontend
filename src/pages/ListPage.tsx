import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listItems } from '../api/items'
import styles from './ListPage.module.css'

export function ListPage() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: listItems,
  })

  const total = items?.reduce((sum, item) => sum + item.price, 0) ?? 0

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Error: {(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Shopping List</h1>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.colIndex}>#</span>
          <span className={styles.colName}>Name</span>
          <span className={styles.colPrice}>Price</span>
        </div>
        {(items ?? []).map((item, index) => (
          <div key={item.id} className={styles.row}>
            <span className={styles.colIndex}>{index + 1}</span>
            <span className={styles.colName}>
              <Link to={`/items/${item.id}`} className={styles.itemLink}>
                {item.name}
              </Link>
            </span>
            <span className={styles.colPrice}>{item.price}</span>
          </div>
        ))}
        <div className={styles.totalRow}>
          <span className={styles.colIndex} />
          <span className={styles.colName}>Total</span>
          <span className={styles.colPrice}>{total}</span>
        </div>
      </div>
      <Link to="/items/new" className={styles.addButton}>
        Add Product
      </Link>
    </div>
  )
}
