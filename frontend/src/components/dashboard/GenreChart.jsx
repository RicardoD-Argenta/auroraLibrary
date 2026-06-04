import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './GenreChart.module.css'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { genre, total, percentage } = payload[0].payload
    return (
      <div className={styles['tooltip']}>
        <p className={styles['tooltip-label']}>{genre}</p>
        <p className={styles['tooltip-value']}>{total} empréstimos — {percentage}%</p>
      </div>
    )
  }
  return null
}

const GenreChart = ({ data = [] }) => {
  return (
    <div className={styles['wrapper']}>
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="genre"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className={styles['legend']}>
        {data.map((item, i) => (
          <li key={i} className={styles['legend-item']}>
            <span className={styles['legend-dot']} style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className={styles['legend-genre']} title={item.genre}>{item.genre}</span>
            <span className={styles['legend-pct']}>{item.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GenreChart