import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useGenre from '../../../hooks/useGenre'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'
import SelectField from '../../../components/form/SelectField'

import GenreItem from './GenreItem'

import styles from '../../../components/form/Form.module.css'

const EditGenre = () => {

    const { getGenre, getGenres, editGenre, deleteGenre } = useGenre()
    const navigate = useNavigate()

    const [initialLoading, setInitialLoading] = useState(true)
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
        await editGenre(payload)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteGenre(genre._id)
        navigate('/book/genre/list')
    }

    useEffect(() => {
        const genreId = new URLSearchParams(window.location.search).get('id')
        if (genreId) {
            const fetchGenre = async () => {
                try {
                    const data = await getGenre(genreId)
                    setGenre(data)
                } catch {
                    navigate('/book/genre/list')
                } finally {
                    setInitialLoading(false)
                }
            }
            fetchGenre()
        } else {
            navigate('/book/genre/list')
        }
    }, [])

    if (initialLoading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar gênero">
            <Button onClick={() => navigate('/book/genre/register')}>Criar novo gênero</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-genre-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-genre-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="ID" type="text" name="id" placeholder="" limit={20} value={genre.code} disabled />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={genre.name} handleOnChange={handleChange} />
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
    </>
  )
}

export default EditGenre