import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuthor from '../../../hooks/useAuthor'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditAuthor = () => {

    const { getAuthor, editAuthor, deleteAuthor, loading } = useAuthor()
    const navigate = useNavigate()
    
    const [author, setAuthor] = useState({
        name: ''
    })

    function handleChange(e) {
        setAuthor({ ...author, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await editAuthor(author)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteAuthor(author._id)
        navigate('/book/author/list')
    }

    useEffect(() => {
        const authorId = new URLSearchParams(window.location.search).get('id')
        if (authorId) {
            const fetchAuthor = async () => {
                try {
                    const author = await getAuthor(authorId)
                    setAuthor(author)
                } catch {
                    navigate('/book/author/list')
                }
            }
            fetchAuthor()
        } else {
            navigate('/book/author/list')
        }
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar autor">
            <Button onClick={() => navigate('/book/author/register')}>Criar novo autor</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-author-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-author-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="ID" type="text" name="id" placeholder="" limit={20} value={author.code} disabled />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome" type="text" name="name" placeholder="" limit={255} value={author.name} handleOnChange={handleChange} />
                    </div>
                    
                </div>
            </form>
        </section>
    </>
  )
}

export default EditAuthor