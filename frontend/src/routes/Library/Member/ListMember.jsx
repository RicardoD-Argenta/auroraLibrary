import { useState, useEffect } from 'react'

// imports
import MemberItem from './MemberItem'

// hooks
import useMember from '../../../hooks/useMember'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListMember = () => {
  const { getMembers, loading } = useMember()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchMembers() {
      const data = await getMembers(page, search)
      setMembers(data.members)
      setTotalPages(data.pages)
    }
    fetchMembers()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Members</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome / id / email / telefone / observações do membro..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={members}
              renderItem={member => <MemberItem key={member._id} item={member} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum membro encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListMember