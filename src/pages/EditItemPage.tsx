import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconCloseCircle } from '../components/Icons'
import { getItem, updateItem } from '../api/items'
import { ItemForm } from '../components/ItemForm'
import styles from './EditItemPage.module.css'

export function EditItemPage() {
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

  const mutation = useMutation({
    mutationFn: (values: { name: string; price: number; description: string }) =>
      updateItem(idNum, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['items', idNum] })
      navigate('/')
    },
  })

  const handleSubmit = (values: { name: string; price: number; description: string }) => {
    mutation.mutate(values)
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
      <div className={styles.formBlock}>
        <Link to="/" className={styles.closeButton} aria-label="Close">
          <IconCloseCircle />
        </Link>
        <h1 className={styles.title}>Edit Item</h1>
        <ItemForm
          initialValues={{
            name: item.name,
            price: item.price,
            description: item.description,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save"
          loading={mutation.isPending}
          errorText={mutation.isError ? (mutation.error as Error).message : undefined}
        />
      </div>
    </div>
  )
}
