import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useBook from '../../../hooks/useBook'
import useGenre from '../../../hooks/useGenre'
import useAuthor from '../../../hooks/useAuthor'
import usePublisher from '../../../hooks/usePublisher'

import GenreItem from '../Genre/GenreItem'
import AuthorItem from '../Author/AuthorItem'
import PublisherItem from '../Publisher/PublisherItem'

// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import SelectField from '../../../components/form/SelectField'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditBook = () => {
    const { getBook, editBook, deleteBook, loading } = useBook()
    const { getGenres } = useGenre()
    const { getAuthors } = useAuthor()
    const { getPublishers } = usePublisher()
    const navigate = useNavigate()

    const [book, setBook] = useState({
        _id: '',
        title: '',
        subtitle: '',
        genres: [],
        authors: [],
        publisher: null,
        language: '',
        isbn: '',
        edition: '',
        year: '',
        pages: '',
        description: '',
    })

    const [showConfirm, setShowConfirm] = useState(false)

    function handleChange(e) {
        setBook({ ...book, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            title: book.title,
            subtitle: book.subtitle,
            genresId: book.genres.map(g => g._id),
            authorsId: book.authors.map(a => a._id),
            publisherId: book.publisher?._id ?? null,
            language: book.language,
            isbn: book.isbn,
            edition: book.edition,
            year: book.year,
            pages: book.pages,
            description: book.description,
        }
        await editBook(book._id, payload)
    }

    async function handleDelete() {
        await deleteBook(book._id)
        navigate('/book/book/list')
    }

    useEffect(() => {
        const bookId = new URLSearchParams(window.location.search).get('id')
        if (bookId) {
            const fetchBook = async () => {
                try {
                    const data = await getBook(bookId)
                    setBook({
                        _id: data._id,
                        title: data.title ?? '',
                        subtitle: data.subtitle ?? '',
                        genres: data.genresId ?? [],
                        authors: data.authorsId ?? [],
                        publisher: data.publisherId ?? null,
                        language: data.language ?? '',
                        isbn: data.isbn ?? '',
                        edition: data.edition ?? '',
                        year: data.year ?? '',
                        pages: data.pages ?? '',
                        description: data.description ?? '',
                    })
                } catch {
                    navigate('/book/book/list')
                }
            }
            fetchBook()
        } else {
            navigate('/book/book/list')
        }
    }, [])

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <PageHeader title="Editar livro">
                <Button onClick={() => navigate('/book/book/register')}>Criar novo livro</Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
                <Button variant="submit" type="submit" form="edit-book-form">Salvar</Button>
            </PageHeader>
            {showConfirm && (
                <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
            )}
            <section className={styles['form-container']}>
                <form id="edit-book-form" onSubmit={handleSubmit}>
                    <div className={styles['form-control']}>
                        <div className={styles['input-wrapper']}>
                            <Input text="Título *" type="text" name="title" placeholder="" limit={255} value={book.title} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Subtítulo" type="text" name="subtitle" placeholder="" limit={255} value={book.subtitle} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Gêneros (até 5) *"
                                multi
                                maxItems={5}
                                value={book.genres}
                                onChange={(items) => setBook({ ...book, genres: items })}
                                fetchItems={async (page, search) => {
                                    const data = await getGenres(page, search)
                                    return { items: data.genres, pages: data.pages }
                                }}
                                getLabel={(item) => item.name}
                                renderItem={(item, onSelect) => <GenreItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Autores (até 5) *"
                                multi
                                maxItems={5}
                                value={book.authors}
                                onChange={(items) => setBook({ ...book, authors: items })}
                                fetchItems={async (page, search) => {
                                    const data = await getAuthors(page, search)
                                    return { items: data.authors, pages: data.pages }
                                }}
                                getLabel={(item) => item.name}
                                renderItem={(item, onSelect) => <AuthorItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Editora *"
                                value={book.publisher}
                                onChange={(item) => setBook({ ...book, publisher: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getPublishers(page, search)
                                    return { items: data.publishers, pages: data.pages }
                                }}
                                getLabel={(item) => item.name}
                                renderItem={(item, onSelect) => <PublisherItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Linguagem *" type="text" name="language" placeholder="" limit={255} value={book.language} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="ISBN *" type="text" name="isbn" placeholder="" limit={20} value={book.isbn} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Edição" type="text" name="edition" placeholder="" limit={255} value={book.edition} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Ano de Publicação *" type="text" name="year" placeholder="" limit={5} value={book.year} handleOnChange={handleChange} number />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Páginas *" type="text" name="pages" placeholder="" limit={4} value={book.pages} handleOnChange={handleChange} number />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Descrição" type="textarea" name="description" placeholder="" limit={500} value={book.description} handleOnChange={handleChange} />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default EditBook