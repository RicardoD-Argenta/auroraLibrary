import { useState, useEffect } from 'react'

// imports
import SectorItem from './SectorItem'

// hooks
import useSector from '../../../hooks/useSector'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListSector = () => {
  const { getSectors, loading } = useSector()
  const [sectors, setSectors] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchSectors() {
      const data = await getSectors(page, search)
      setSectors(data.sectors)
      setTotalPages(data.pages)
    }
    fetchSectors()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Setores</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id do setor..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={sectors}
              renderItem={sector => <SectorItem key={sector._id} item={sector} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum setor encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListSector