import styles from './List.module.css'

const List = ({ loading, items, renderItem, emptyMessage = 'Nenhum item encontrado.' }) => {
  if (loading) return <p>Carregando...</p>

  return (
    <div className={styles.list}>
      <ul>
        {items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <p>{emptyMessage}</p>
        )}
      </ul>
    </div>
  )
}

export default List
