import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useBookCopy from '../../../hooks/useBookCopy'
import useBook from '../../../hooks/useBook'
import useSector from '../../../hooks/useSector'
import useShelf from '../../../hooks/useShelf'


// Components
import Input from '../../../components/form/Input'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import SelectField from '../../../components/form/SelectField'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import BookItem from '../Book/BookItem'
import SectorItem from '../../Library/Sector/SectorItem'
import ShelfItem from '../../Library/Shelf/ShelfItem'

import styles from '../../../components/form/Form.module.css'

const EditBookCopy = () => {
    const { getBookCopy, editBookCopy, deleteBookCopy, loading } = useBookCopy()
    const { getBooks } = useBook()
    const { getSectors } = useSector()
    const { getShelves } = useShelf()

    const navigate = useNavigate()

    const [bookCopy, setBookCopy] = useState({
        _id: '',
        book: null,
        sector: null,
        shelf: null,
        copycode: '',
        status: '',
        condition: '',
        acquireAt: '',
        notes: '',
    })

    const [showConfirm, setShowConfirm] = useState(false)

    function handleChange(e) {
        setBookCopy({ ...bookCopy, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const rawDate = bookCopy.acquireAt
        const acquireAt = rawDate ? (() => { const [y, m, d] = rawDate.split('-'); return `${m}-${d}-${y}` })() : undefined
        const payload = {
            bookId: bookCopy.book?._id,
            sectorId: bookCopy.sector?._id,
            shelfId: bookCopy.shelf?._id,
            copycode: bookCopy.copycode,
            status: bookCopy.status,
            condition: bookCopy.condition,
            acquireAt,
            notes: bookCopy.notes,
        }
        await editBookCopy(bookCopy._id, payload)
    }

    async function handleDelete() {
        await deleteBookCopy(bookCopy._id)
        navigate('/book/bookcopy/list')
    }

    useEffect(() => {
        const bookCopyId = new URLSearchParams(window.location.search).get('id')
        if (bookCopyId) {
            const fetchBookCopy = async () => {
                try {
                    const data = await getBookCopy(bookCopyId)
                    setBookCopy({
                        _id: data._id,
                        book: data.bookId ?? null,
                        sector: data.sectorId ?? null,
                        shelf: data.shelfId ?? null,
                        copycode: data.copycode ?? '',
                        status: data.status ?? '',
                        condition: data.condition ?? '',
                        acquireAt: data.acquireAt
                            ? new Date(data.acquireAt).toISOString().slice(0, 10)
                            : '',
                        notes: data.notes ?? '',
                    })
                } catch {
                    navigate('/book/bookcopy/list')
                }
            }
            fetchBookCopy()
        } else {
            navigate('/book/bookcopy/list')
        }
    }, [])

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <PageHeader title="Editar exemplar">
                <Button onClick={() => navigate('/book/bookcopy/register')}>Criar novo exemplar</Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
                <Button variant="submit" type="submit" form="edit-book-copy-form">Salvar</Button>
            </PageHeader>
            {showConfirm && (
                <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
            )}
            <section className={styles['form-container']}>
                <form id="edit-book-copy-form" onSubmit={handleSubmit}>
                    <div className={styles['form-control']}>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Livro *"
                                value={bookCopy.book}
                                onChange={(item) => setBookCopy({ ...bookCopy, book: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getBooks(page, search)
                                    return { items: data.books, pages: data.pages }
                                }}
                                getLabel={(item) => item.title}
                                renderItem={(item, onSelect) => <BookItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Setor *"
                                value={bookCopy.sector}
                                onChange={(item) => setBookCopy({ ...bookCopy, sector: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getSectors(page, search)
                                    return { items: data.sectors, pages: data.pages }
                                }}
                                getLabel={(item) => item.name}
                                renderItem={(item, onSelect) => <SectorItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Prateleira *"
                                value={bookCopy.shelf}
                                onChange={(item) => setBookCopy({ ...bookCopy, shelf: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getShelves(page, search)
                                    return { items: data.shelves, pages: data.pages }
                                }}
                                getLabel={(item) => item.name}
                                renderItem={(item, onSelect) => <ShelfItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Código Interno *" type="text" name="copycode" placeholder="" limit={20} value={bookCopy.copycode} handleOnChange={handleChange} number />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <EnumSelect
                                text="Status *"
                                name="status"
                                value={bookCopy.status}
                                handleOnChange={handleChange}
                                options={[
                                    { label: 'Disponível', value: 'available' },
                                    { label: 'Emprestado', value: 'borrowed' },
                                    { label: 'Reservado', value: 'reserved' },
                                    { label: 'Perdido', value: 'lost' },
                                    { label: 'Em manutenção', value: 'maintenance' },
                                ]}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <EnumSelect
                                text="Condição *"
                                name="condition"
                                value={bookCopy.condition}
                                handleOnChange={handleChange}
                                options={[
                                    { label: 'Novo', value: 'new' },
                                    { label: 'Bom', value: 'good' },
                                    { label: 'Desgastado', value: 'worn' },
                                    { label: 'Danificado', value: 'damaged' },
                                ]}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Data da aquisição *" type="date" name="acquireAt" value={bookCopy.acquireAt} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Notas " type="textarea" name="notes" placeholder="" limit={500} value={bookCopy.notes} handleOnChange={handleChange} />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default EditBookCopy