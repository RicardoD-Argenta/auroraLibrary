import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './BookCopyItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'
import { GRADES } from '../../../components/form/ClassSelect'

// hooks
import useBookCopy from '../../../hooks/useBookCopy'

const BookCopyItem = ({ item, onClick, onDeleteSuccess }) => {
    const { deleteBookCopy } = useBookCopy()
    const navigate = useNavigate()
    const [bookOpen, setBookOpen] = useState(false)

    function formatDate(val) {
        if (!val) return ''
        return new Date(val).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    async function handleDelete(bookId) {
        await deleteBookCopy(bookId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(bookId) {
        navigate(`/book/bookcopy/edit?id=${bookId}`)
    }

    const STATUS_LABEL = { available: 'Disponível', borrowed: 'Emprestado', reserved: 'Reservado', lost: 'Perdido', maintenance: 'Manutenção' }
    const CONDITION_LABEL = { new: 'Novo', good: 'Bom', worn: 'Desgastado', damaged: 'Danificado' }

    const status = STATUS_LABEL[item.status] ?? item.status
    const condition = CONDITION_LABEL[item.condition] ?? item.condition

    if (onClick) {
        return ( 
            <li className={styles.clickable} onClick={onClick}>
                <div className={styles.itemContainer}>
                    <div className={styles.contentContainer}>
                        <span className={styles.code}>ID: {item.code}</span>
                        <div className={`${styles.bookContainer} ${styles.clickableBook}`} onClick={(e) => { e.stopPropagation(); setBookOpen(v => !v); }}>
                            <div className={styles.labelContainer}>
                                <span className={styles.label}>Livro:</span>
                                <span className={styles.name}>{item.bookId.title}</span>
                                <span className={`${styles.chevron} ${bookOpen ? styles.chevronOpen : ''}`}>&#8250;</span>
                            </div>
                            {bookOpen && (
                                <div className={styles.bookDropdown}>
                                    {item.bookId.subtitle && (
                                        <div className={styles.labelContainer}>
                                            <span className={styles.label}>Subtítulo:</span>
                                            <span className={styles.name}>{item.bookId.subtitle}</span>
                                        </div>
                                    )}
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Autor(es):</span>
                                        <span className={styles.name}>{item.bookId.authorsId.map(a => a.name).join(', ')}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Editora:</span>
                                        <span className={styles.name}>{item.bookId.publisherId.name}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Gênero(s):</span>
                                        <span className={styles.name}>{item.bookId.genresId.map(g => g.name).join(', ')}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Idioma:</span>
                                        <span className={styles.name}>{item.bookId.language}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>ISBN:</span>
                                        <span className={styles.name}>{item.bookId.isbn}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Edição:</span>
                                        <span className={styles.name}>{item.bookId.edition}</span>
                                    </div>
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Ano:</span>
                                        <span className={styles.name}>{item.bookId.year}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.labelVariant}>Código do exemplar:</span>
                            <span className={styles.name}>{item.copycode}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Setor:</span>
                            <span className={styles.name}>{item.sectorId.name}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Prateleira:</span>
                            <span className={styles.name}>{item.shelfId.name}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Status:</span>
                            <span className={styles.name}>{status}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Condição:</span>
                            <span className={styles.name}>{condition}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.labelVariant}>Data da aquisição:</span>
                            <span className={styles.name}>{formatDate(item.acquireAt)}</span>
                        </div>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Notas:</span>
                            <span className={styles.name}>{item.notes ? item.notes : 'Não definido'}</span>
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
                    <div className={`${styles.bookContainer} ${styles.clickableBook}`} onClick={() => setBookOpen(v => !v)}>
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Livro:</span>
                            <span className={styles.name}>{item.bookId.title}</span>
                            <span className={`${styles.chevron} ${bookOpen ? styles.chevronOpen : ''}`}>&#8250;</span>
                        </div>
                        {bookOpen && (
                            <div className={styles.bookDropdown}>
                                {item.bookId.subtitle && (
                                    <div className={styles.labelContainer}>
                                        <span className={styles.label}>Subtítulo:</span>
                                        <span className={styles.name}>{item.bookId.subtitle}</span>
                                    </div>
                                )}
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Autor(es):</span>
                                    <span className={styles.name}>{item.bookId.authorsId.map(a => a.name).join(', ')}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Editora:</span>
                                    <span className={styles.name}>{item.bookId.publisherId.name}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Gênero(s):</span>
                                    <span className={styles.name}>{item.bookId.genresId.map(g => g.name).join(', ')}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Idioma:</span>
                                    <span className={styles.name}>{item.bookId.language}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>ISBN:</span>
                                    <span className={styles.name}>{item.bookId.isbn}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Edição:</span>
                                    <span className={styles.name}>{item.bookId.edition}</span>
                                </div>
                                <div className={styles.labelContainer}>
                                    <span className={styles.label}>Ano:</span>
                                    <span className={styles.name}>{item.bookId.year}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Código do exemplar:</span>
                        <span className={styles.name}>{item.copycode}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Setor:</span>
                        <span className={styles.name}>{item.sectorId.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Prateleira:</span>
                        <span className={styles.name}>{item.shelfId.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.name}>{status}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Condição:</span>
                        <span className={styles.name}>{condition}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Data da aquisição:</span>
                        <span className={styles.name}>{formatDate(item.acquireAt)}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Notas:</span>
                        <span className={styles.name}>{item.notes ? item.notes : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default BookCopyItem
