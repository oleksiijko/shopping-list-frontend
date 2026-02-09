import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ListPage } from './pages/ListPage'
import { AddItemPage } from './pages/AddItemPage'
import { ItemPage } from './pages/ItemPage'
import { EditItemPage } from './pages/EditItemPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListPage />} />
        <Route path="/items/new" element={<AddItemPage />} />
        <Route path="/items/:id/edit" element={<EditItemPage />} />
        <Route path="/items/:id" element={<ItemPage />} />
      </Route>
    </Routes>
  )
}

export default App
