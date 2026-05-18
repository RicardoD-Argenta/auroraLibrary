import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useGenre from '../../../hooks/useGenre'

import GenreItem from './GenreItem'

// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import SelectField from '../../../components/form/SelectField'

import styles from '../../../components/form/Form.module.css'

const CreateGenre = () => {
    const { createGenre, getGenres, loading } = useGenre()
    const navigate = useNavigate()

    const [genre, setGenre] = useState({
        name: '',
        parentId: null
    })

    function handleChange(e) {
        setGenre({ ...genre, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = { ...genre, parentId: genre.parentId?._id ?? null }
        const newGenre = await createGenre(payload)
        setGenre({ name: '', parentId: null })
        navigate(`/book/genre/edit?id=${newGenre._id}`)
    }

  return (
    <div>
        <PageHeader title="Novo gênero">
            <Button variant="submit" type="submit" form="create-genre-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-genre-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" id="name" name="name" placeholder="" limit={255} value={genre.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <SelectField
                            label="Gênero Pai"
                            renderItem={(item, onSelect) => <GenreItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            value={genre.parentId}
                            onChange={(item) => setGenre({ ...genre, parentId: item })}
                            fetchItems={async (page, search) => {
                                const data = await getGenres(page, search)
                                return { items: data.genres, pages: data.pages }
                            }}
                            getLabel={(item) => item.name}
                        />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreateGenre