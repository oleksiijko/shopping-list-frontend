import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItem, updateItem } from '../../api/items'
import { ItemForm } from '../ItemForm'
import { Modal } from '../Modal'
import { IconCloseCircle } from '../Icons'
import styles from './EditItemModal.module.css'

interface EditItemModalProps {
  onClose: () => void
}

export function EditItemModal({ onClose }: EditItemModalProps) {
  const { id } = useParams()
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
      onClose()
    },
  })

  const handleSubmit = (values: { name: string; price: number; description: string }) => {
    mutation.mutate(values)
  }

  if (!isValidId) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.inner}>
          <p className={styles.error}>Invalid item ID</p>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </Modal>
    )
  }

  if (isLoading) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.inner}>Loading...</div>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.inner}>
          <p className={styles.error}>Error: {(error as Error).message}</p>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </Modal>
    )
  }

  if (!item) {
    return null
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.inner}>
        <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
          <IconCloseCircle />
        </button>
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
    </Modal>
  )
}
