import { Routes, Route } from 'react-router-dom'
import { ListPage } from './pages/ListPage'
import { AddItemPage } from './pages/AddItemPage'
import { ItemPage } from './pages/ItemPage'
import { EditItemPage } from './pages/EditItemPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/items/new" element={<AddItemPage />} />
      <Route path="/items/:id/edit" element={<EditItemPage />} />
      <Route path="/items/:id" element={<ItemPage />} />
    </Routes>
  )
}

export default App
