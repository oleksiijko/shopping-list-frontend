import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { createItem } from '../api/items'
import { ItemForm } from '../components/ItemForm'
import styles from './AddItemPage.module.css'

export function AddItemPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/')
    },
  })

  const handleSubmit = (values: { name: string; price: number; description: string }) => {
    mutation.mutate(values)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBlock}>
        <Link to="/" className={styles.closeButton} aria-label="Close">
          <FaTimes />
        </Link>
        <h1 className={styles.title}>Add Item</h1>
        <ItemForm
          initialValues={{ name: '', price: 0, description: '' }}
          onSubmit={handleSubmit}
          submitLabel="Save"
          loading={mutation.isPending}
          errorText={mutation.isError ? (mutation.error as Error).message : undefined}
        />
      </div>
    </div>
  )
}
