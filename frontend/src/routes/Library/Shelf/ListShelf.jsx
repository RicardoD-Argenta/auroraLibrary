import { useState, useEffect } from 'react'

// imports
import ShelfItem from './ShelfItem'

// hooks
import useShelf from '../../../hooks/useShelf'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListShelf = () => {
  const { getShelves, loading } = useShelf()
  const [shelves, setShelves] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchShelves() {
      const data = await getShelves(page, search)
      setShelves(data.shelves)
      setTotalPages(data.pages)
    }
    fetchShelves()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Prateleiras</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id da prateleira..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={shelves}
              renderItem={shelf => <ShelfItem key={shelf._id} item={shelf} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhuma prateleira encontrada."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListShelf