import { Link, useNavigate } from 'react-router-dom'
import styles from './BookItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'
import { GRADES } from '../../../components/form/ClassSelect'

// hooks
import useBook from '../../../hooks/useBook'

const BookItem = ({ item, onClick, onDeleteSuccess }) => {
    const { deleteBook } = useBook()
    const navigate = useNavigate()

    async function handleDelete(bookId) {
        await deleteBook(bookId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(bookId) {
        navigate(`/book/book/edit?id=${bookId}`)
    }

    if (onClick) {
        return (
            <li className={styles.clickable} onClick={onClick}>
                <div className={styles.itemContainer}>
                    <div className={styles.contentContainer}>
                        <span className={styles.code}>ID: {item.code}</span>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Título:</span>
                            <span className={styles.name}>{item.title}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Subtítulo:</span>
                            <span className={styles.name}>{item.subtitle ? item.subtitle : 'Não definido'}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Autores:</span>
                            <span className={styles.name}>{item.authorsId?.map(a => a.name).join(', ') || 'Não definido'}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Editora:</span>
                            <span className={styles.name}>{item.publisherId?.name || 'Não definido'}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Gêneros:</span>
                            <span className={styles.name}>{item.genresId?.map(g => g.name).join(', ') || 'Não definido'}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Idioma:</span>
                            <span className={styles.name}>{item.language}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>ISBN:</span>
                            <span className={styles.name}>{item.isbn}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Edição:</span>
                            <span className={styles.name}>{item.edition ? item.edition : 'Não definido'}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.labelVariant}>Ano de Publicação:</span>
                            <span className={styles.name}>{item.year}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Páginas:</span>
                            <span className={styles.name}>{item.pages}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Descrição:</span>
                            <span className={styles.name}>{item.description ? item.description : 'Não definido'}</span>
                        </div>
                    </div>
                </div>
            </li>
        )
    }

    return (
        <li>
            <div className={styles.itemContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.code}>ID: {item.code}</span>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Título:</span>
                        <span className={styles.name}>{item.title}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Subtítulo:</span>
                        <span className={styles.name}>{item.subtitle ? item.subtitle : 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Autores:</span>
                        <span className={styles.name}>{item.authorsId?.map(a => a.name).join(', ') || 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Editora:</span>
                        <span className={styles.name}>{item.publisherId?.name || 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Gêneros:</span>
                        <span className={styles.name}>{item.genresId?.map(g => g.name).join(', ') || 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Idioma:</span>
                        <span className={styles.name}>{item.language}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>ISBN:</span>
                        <span className={styles.name}>{item.isbn}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Edição:</span>
                        <span className={styles.name}>{item.edition ? item.edition : 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Ano de Publicação:</span>
                        <span className={styles.name}>{item.year}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Páginas:</span>
                        <span className={styles.name}>{item.pages}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Descrição:</span>
                        <span className={styles.name}>{item.description ? item.description : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default BookItem
