import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaTrash, FaPencilAlt } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import { listItems, removeItem } from '../api/items'
import styles from './ListPage.module.css'

export function ListPage() {
  const queryClient = useQueryClient()
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: listItems,
  })

  const deleteMutation = useMutation({
    mutationFn: removeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const handleDelete = (itemId: number) => {
    if (!window.confirm('Delete item?')) return
    deleteMutation.mutate(itemId)
  }

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
      <h1 className={styles.title}>Shopping List</h1>
      {deleteMutation.isError && (
        <p className={styles.error}>
          Error: {(deleteMutation.error as Error).message}
        </p>
      )}
      <div className={styles.list}>
        {(items ?? []).map((item, index) => (
          <div key={item.id} className={styles.row}>
            <span className={styles.colIndex}>{index + 1}</span>
            <span className={styles.colName}>
              <Link to={`/items/${item.id}`} className={styles.itemLink}>
                {item.name}
              </Link>
            </span>
            <span className={styles.colPrice}>{item.price} NIS</span>
            <span className={styles.colActions}>
              <Link
                to={`/items/${item.id}/edit`}
                className={styles.iconButton}
                title="Edit"
                aria-label="Edit item"
              >
                <FaPencilAlt />
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deleteMutation.isPending && deleteMutation.variables === item.id}
                className={styles.iconButton}
                title="Delete"
                aria-label="Delete item"
              >
                <FaTrash />
              </button>
            </span>
          </div>
        ))}
        <div className={styles.totalRow}>
          <span className={styles.colIndex} />
          <span className={styles.colName}>Total :</span>
          <span className={styles.colPrice}>{total} NIS</span>
          <span className={styles.colActions} />
        </div>
      </div>
      <Link to="/items/new" className={styles.addButton}>
        <HiPlus className={styles.addIcon} />
        Add Product
      </Link>
    </div>
  )
}
