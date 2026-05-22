import { useState } from 'react'
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

import styles from '../../../components/form/Form.module.css'

const CreateBook = () => {
    const { createBook, loading } = useBook()
    const { getGenres } = useGenre()
    const { getAuthors } = useAuthor()
    const { getPublishers } = usePublisher()
    const navigate = useNavigate()

    const [book, setBook] = useState({
        title: '',
        subtitle: '',
        genres: [],
        authors: [],
        publisher: null,
        language: 'Português',
        isbn: '',
        edition: '',
        year: '',
        pages: '',
        description: '',
    })

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
        const newBook = await createBook(payload)
        setBook({ title: '', subtitle: '', genres: [], authors: [], publisher: null, language: 'Português', isbn: '', edition: '', year: '', pages: '', description: '' })
        navigate(`/book/book/edit?id=${newBook._id}`)
    }

    return (
        <div>
            <PageHeader title="Novo livro">
                <Button variant="submit" type="submit" form="create-book-form">Salvar</Button>
            </PageHeader>
            <section className={styles['form-container']}>
                <form id="create-book-form" onSubmit={handleSubmit}>
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
                            <Input text="ISBN *" type="text" name="isbn" placeholder="" limit={20} value={book.isbn} handleOnChange={handleChange} number />
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
                            <Input text="Descrição" type="textarea" id="description" name="description" placeholder="" limit={500} value={book.description} handleOnChange={handleChange} />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CreateBook