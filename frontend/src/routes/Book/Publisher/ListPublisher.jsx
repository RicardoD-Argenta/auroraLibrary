import { useState, useEffect } from 'react'

// imports
import PublisherItem from './PublisherItem'

// hooks
import usePublisher from '../../../hooks/usePublisher'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from './ListPublisher.module.css'

const ListPublisher = () => {
  const { getPublishers, loading } = usePublisher()
  const [publishers, setPublishers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchPublishers() {
      const data = await getPublishers(page, search)
      setPublishers(data.publishers)
      setTotalPages(data.pages)
    }
    fetchPublishers()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Editoras</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id da editora..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={publishers}
              renderItem={publisher => <PublisherItem key={publisher._id} item={publisher} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhuma editora encontrada."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListPublisher