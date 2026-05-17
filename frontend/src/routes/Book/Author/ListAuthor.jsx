import { useState, useEffect } from 'react'

// imports
import AuthorItem from './AuthorItem'

// hooks
import useAuthor from '../../../hooks/useAuthor'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListAuthor = () => {
  const { getAuthors, loading } = useAuthor()
  const [authors, setAuthors] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchAuthors() {
      const data = await getAuthors(page, search)
      setAuthors(data.authors)
      setTotalPages(data.pages)
    }
    fetchAuthors()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Autores</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id do autor..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={authors}
              renderItem={author => <AuthorItem key={author._id} item={author} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum autor encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListAuthor