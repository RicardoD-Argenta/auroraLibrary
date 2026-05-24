import { useState, useEffect } from 'react'

// imports
import BookCopyItem from './BookCopyItem'

// hooks
import useBookCopy from '../../../hooks/useBookCopy'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'
import EnumSelect from '../../../components/form/EnumSelect'

import styles from '../../../components/layout/List.module.css'

const ListBookCopy = () => {
  const { getBookCopies, loading } = useBookCopy()
  const [bookCopies, setBookCopies] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [condition, setCondition] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchBookCopies() {
      const data = await getBookCopies(page, search, status, condition)
      setBookCopies(data.bookCopies)
      setTotalPages(data.pages)
    }
    fetchBookCopies()
  }, [page, search, status, condition, refresh])

  return (
    <div>
        <div className="header">
          <h2>Exemplares</h2>
        </div>
        <section>
          <div className={`${styles.searchContainer} ${styles.multiple}`}>
            <div className={styles.searchBar}>
              <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite qualquer campo do exemplar de livro..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <div className={styles.statusFilter}>
              <EnumSelect text="Status" name="status" value={status} handleOnChange={(e) => { setStatus(e.target.value); setPage(1) }} options={[
                { label: 'Todos', value: '' },
                { label: 'Disponível', value: 'available' },
                { label: 'Emprestado', value: 'borrowed' },
                { label: 'Reservado', value: 'reserved' },
                { label: 'Perdido', value: 'lost' },
                { label: 'Em manutenção', value: 'maintenance' },
              ]} />
            </div>
            <div className={styles.statusFilter}>
              <EnumSelect text="Condição" name="condition" value={condition} handleOnChange={(e) => { setCondition(e.target.value); setPage(1) }} options={[
                { label: 'Todos', value: '' },
                { label: 'Novo', value: 'new' },
                { label: 'Bom', value: 'good' },
                { label: 'Desgastado', value: 'worn' },
                { label: 'Danificado', value: 'damaged' },
              ]} />
            </div>
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={bookCopies}
              renderItem={bookCopy => <BookCopyItem key={bookCopy._id} item={bookCopy} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum exemplar de livro encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListBookCopy