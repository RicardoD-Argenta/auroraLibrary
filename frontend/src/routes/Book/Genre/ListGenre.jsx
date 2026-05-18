import { useState, useEffect } from 'react'

// imports
import GenreItem from './GenreItem'

// hooks
import useGenre from '../../../hooks/useGenre'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListGenre = () => {
  const { getGenres, loading } = useGenre()
  const [genres, setGenres] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchGenres() {
      const data = await getGenres(page, search)
      setGenres(data.genres)
      setTotalPages(data.pages)
    }
    fetchGenres()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Gêneros</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id do gênero..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={genres}
              renderItem={genre => <GenreItem key={genre._id} item={genre} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum gênero encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListGenre