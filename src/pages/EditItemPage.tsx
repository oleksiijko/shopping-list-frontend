import { useParams } from 'react-router-dom'

export function EditItemPage() {
  const { id } = useParams()
  return <h1>Edit Item {id} (stub)</h1>
}
