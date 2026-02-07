import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
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
      <h1>Add Item</h1>
      <Link to="/" className={styles.backLink}>
        Back
      </Link>
      <ItemForm
        initialValues={{ name: '', price: 0, description: '' }}
        onSubmit={handleSubmit}
        submitLabel="Save"
        loading={mutation.isPending}
        errorText={mutation.isError ? (mutation.error as Error).message : undefined}
      />
    </div>
  )
}
