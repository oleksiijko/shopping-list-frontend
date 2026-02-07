import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { Layout } from './components/Layout'
import { ListPage } from './pages/ListPage'
import { AddItemPage } from './pages/AddItemPage'
import { ItemPage } from './pages/ItemPage'
import { EditItemPage } from './pages/EditItemPage'
import { AddItemModal } from './components/AddItemModal'
import { EditItemModal } from './components/EditItemModal'
import './App.css'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { backgroundLocation?: ReturnType<typeof useLocation> } | undefined
  const backgroundLocation = state?.backgroundLocation

  const closeModal = useCallback(() => {
    if (backgroundLocation) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }, [navigate, backgroundLocation])

  const isAddModal = location.pathname === '/items/new'
  const isEditModal = /^\/items\/\d+\/edit$/.test(location.pathname)

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route element={<Layout />}>
          <Route path="/" element={<ListPage />} />
          <Route path="/items/new" element={<AddItemPage />} />
          <Route path="/items/:id/edit" element={<EditItemPage />} />
          <Route path="/items/:id" element={<ItemPage />} />
        </Route>
      </Routes>

      {backgroundLocation && (isAddModal || isEditModal) && (
        <Routes>
          <Route
            path="/items/new"
            element={<AddItemModal onClose={closeModal} />}
          />
          <Route
            path="/items/:id/edit"
            element={<EditItemModal onClose={closeModal} />}
          />
        </Routes>
      )}
    </>
  )
}

export default App
