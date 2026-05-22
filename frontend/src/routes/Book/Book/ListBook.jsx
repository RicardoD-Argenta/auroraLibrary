import { useState, useEffect } from 'react'

// imports
import BookItem from './BookItem'

// hooks
import useBook from '../../../hooks/useBook'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListBook = () => {
  const { getBooks, loading } = useBook()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchBooks() {
      const data = await getBooks(page, search)
      setBooks(data.books)
      setTotalPages(data.pages)
    }
    fetchBooks()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Books</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite qualquer campo do livro..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={books}
              renderItem={book => <BookItem key={book._id} item={book} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum livro encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListBook