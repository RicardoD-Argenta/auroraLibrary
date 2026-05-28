import { useState, useEffect } from 'react'

// imports
import LoanItem from './LoanItem'

// hooks
import useLoan from '../../../hooks/useLoan'

// components
import Input from '../../../components/form/Input'
import Pagination from '../../../components/lists/Pagination'
import List from '../../../components/lists/List'
import EnumSelect from '../../../components/form/EnumSelect'

import styles from '../../../components/layout/List.module.css'

const ListLoan = () => {
  const { getLoans, loading } = useLoan()
  const [loans, setLoans] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchLoans() {
      const data = await getLoans(page, search, status, fromDate, toDate)
      setLoans(data.loans)
      setTotalPages(data.pages)
    }
    fetchLoans()
  }, [page, search, status, fromDate, toDate, refresh])

  return (
    <div>
        <div className="header">
          <h2>Empréstimos</h2>
        </div>
        <section>
          <div className={`${styles.searchContainer} ${styles.multiple}`}>
            <div className={styles.searchBar}>
              <Input text="Pesquisar" type="text" id="search" name="search" placeholder="Digite qualquer campo do empréstimo..." value={search} handleOnChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <div className={styles.statusFilter}>
              <EnumSelect text="Status" name="status" value={status} handleOnChange={(e) => { setStatus(e.target.value); setPage(1) }} options={[
                { label: 'Todos', value: '' },
                { label: 'Ativo', value: 'active' },
                { label: 'Devolvido', value: 'returned' },
                { label: 'Atrasado', value: 'overdue' },
                { label: 'Perdido', value: 'lost' },
              ]} />
            </div>
          </div>
          <div className={`${styles.dateContainer} ${styles.multiple}`}>
            <div className={styles.fromDate}>
               <Input text="Data Inicial" type="date" name="fromDate" value={fromDate} handleOnChange={(e) => { setFromDate(e.target.value); setToDate(''); setPage(1) }} />
            </div>
            <div className={styles.toDate}>
                <Input text="Data Final" type="date" name="toDate" value={toDate} min={fromDate} handleOnChange={(e) => { setToDate(e.target.value); setPage(1) }} />
            </div>
          </div>
          <div className={styles.listContainer}>
            <List
              loading={loading}
              items={loans}
              renderItem={loan => <LoanItem key={loan._id} item={loan} onDeleteSuccess={() => setRefresh(r => r + 1)} />}
              emptyMessage="Nenhum empréstimo encontrado."
            />
          </div>
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>
    </div>
  )
}

export default ListLoan