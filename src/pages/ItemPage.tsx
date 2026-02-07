import { useParams } from 'react-router-dom'

export function ItemPage() {
  const { id } = useParams()
  return <h1>Item {id} (stub)</h1>
}
