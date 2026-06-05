import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useToast from '../hooks/useToast'
import useDashboard from '../hooks/useDashboard'

import styles from './Home.module.css'

// Icons
import { FaBook } from "react-icons/fa";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { FaBookmark } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";

// Components
import Card from '../components/dashboard/Card'
import AlertItem from '../components/dashboard/AlertItem'
import List from '../components/lists/List'
import MonthLoans from '../components/dashboard/MonthLoans'
import TopBooksChart from '../components/dashboard/TopBooksChart'
import GenreChart from '../components/dashboard/GenreChart'
import RecentActivity from '../components/dashboard/RecentActivity'

const Home = () => {
  const location = useLocation()
  const toast = useToast()
  const { getDashboard, loading } = useDashboard()

  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [])

  useEffect(() => {
    getDashboard()
      .then(data => setDashboard(data))
      .catch(() => {})
  }, [])

  function formatVariation(value) {
    if (value === null || value === undefined) return ''
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value}% em relação ao mês passado`
  }

  return (
    <div className={styles["home-container"]}>
      <header>
        <div className={styles["header-text"]}>
          <h2>Home</h2>
        </div>
        <main>
          <div className={styles["cards-list"]}>
            <div className={styles["card-wrapper"]}>
              <Card icon={<FaBook />} title="Empréstimos ativos" data={dashboard?.activeLoans ?? '-'} subtitle={formatVariation(dashboard?.loanVariation)} />
            </div>
            <div className={styles["card-wrapper"]}>
              <Card icon={<TbAlertTriangleFilled />} title="Empréstimos vencidos" data={dashboard?.overdueLoans ?? '-'} subtitle={formatVariation(dashboard?.delayVariation)} />
            </div>
            <div className={styles["card-wrapper"]}>
              <Card icon={<FaBookmark />} title="Exemplares Disponíveis" data={dashboard?.availableCopies ?? '-'} subtitle={dashboard ? `${dashboard.totalCopies} exemplares no acervo` : ''} />
            </div>
            <div className={styles["card-wrapper"]}>
              <Card icon={<FaUsers />} title="Membros Cadastrados" data={dashboard?.totalMembers ?? '-'} subtitle={dashboard ? `${dashboard.newMembersThisMonth} novos este mês` : ''} />
            </div>
          </div>
          <div className={styles["alert-list"]} style={{ display: dashboard?.overdueList?.length ? 'flex' : 'none' }}>
            <List 
            loading={loading}
            items={dashboard?.overdueList ?? []}
            renderItem={item => <AlertItem key={item.overdueId} item={item} />}
            emptyMessage="Nenhum alerta encontrado."
            />
            {dashboard?.overdueRemaining ? <div className={styles["remaining-alerts"]}>+ {dashboard.overdueRemaining} empréstimos atrasados</div> : null}
          </div>
          <div className={styles["books-container"]}>
            <div className={styles["month-graph"]}>
              <div className={styles["title"]}>
                <h3>Empréstimos por mês</h3>
              </div>
              <MonthLoans data={dashboard?.loansByMonth ?? []} />
            </div>
            <div className={styles["books-list"]}>
              <div className={styles["title"]}>
                <h3>Exemplares mais emprestados</h3>
              </div>
              <TopBooksChart data={dashboard?.topBooks ?? []} />
            </div>
          </div>
          <div className={styles["curiosities-container"]}>
            <div className={styles["genre-distribution"]}>
              <div className={styles["title"]}>
                <h3>Acervo por gênero</h3>
              </div>
              <GenreChart data={dashboard?.genreDistribution ?? []} />
            </div>
            <div className={styles["recent-activity"]}>
              <List
                loading={loading}
                items={dashboard?.recentActivity ?? []}
                renderItem={item => <RecentActivity key={item.loanId} item={item} />}
                emptyMessage="Nenhuma atividade encontrada."
              />
            </div>
          </div>
        </main>
      </header>
      
    </div>
  )
}

export default Home