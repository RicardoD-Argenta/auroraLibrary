import { useState, useEffect } from 'react'

// imports
import UserItem from './UserItem'

// hooks
import useAuth from '../../../hooks/useAuth'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'

import styles from '../../../components/layout/List.module.css'

const ListUsers = () => {
  const { getUsers, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers(page, search)
      setUsers(data.users)
      setTotalPages(data.pages)
    }
    fetchUsers()
  }, [page, search, refresh])

  return (
    <div>
        <div className="header">
          <h2>Usuários</h2>
        </div>
        <section>
          <div className={styles.searchContainer}>
            <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite o nome ou id do usuário..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.listContainer}>
              <List
              loading={loading}
              items={users}
              renderItem={user => <UserItem key={user._id} item={user} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum usuário encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListUsers