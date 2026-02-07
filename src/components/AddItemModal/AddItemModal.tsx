import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem } from '../../api/items'
import { ItemForm } from '../ItemForm'
import { Modal } from '../Modal'
import { IconCloseCircle } from '../Icons'
import styles from './AddItemModal.module.css'

interface AddItemModalProps {
  onClose: () => void
}

export function AddItemModal({ onClose }: AddItemModalProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      onClose()
    },
  })

  const handleSubmit = (values: { name: string; price: number; description: string }) => {
    mutation.mutate(values)
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.inner}>
        <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
          <IconCloseCircle />
        </button>
        <h1 className={styles.title}>Add Item</h1>
        <ItemForm
          initialValues={{ name: '', price: 0, description: '' }}
          onSubmit={handleSubmit}
          submitLabel="Save"
          loading={mutation.isPending}
          errorText={mutation.isError ? (mutation.error as Error).message : undefined}
        />
      </div>
    </Modal>
  )
}
