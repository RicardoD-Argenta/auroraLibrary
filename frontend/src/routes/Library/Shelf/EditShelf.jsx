import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useShelf from '../../../hooks/useShelf'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditShelf = () => {

    const { getShelf, editShelf, deleteShelf, loading } = useShelf()
    const navigate = useNavigate()
    
    const [shelf, setShelf] = useState({
        name: '',
        description: ''
    })

    function handleChange(e) {
        setShelf({ ...shelf, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await editShelf(shelf)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteShelf(shelf._id)
        navigate('/library/shelf/list')
    }

    useEffect(() => {
        const shelfId = new URLSearchParams(window.location.search).get('id')
        if (shelfId) {
            const fetchShelf = async () => {
                try {
                    const shelf = await getShelf(shelfId)
                    setShelf(shelf)
                } catch {
                    navigate('/library/shelf/list')
                }
            }
            fetchShelf()
        } else {
            navigate('/library/shelf/list')
        }
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar prateleira">
            <Button onClick={() => navigate('/library/shelf/register')}>Criar nova prateleira</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-shelf-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-shelf-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="ID" type="text" name="id" placeholder="" limit={20} value={shelf.code} disabled />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={shelf.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Descrição" type="text" name="description" placeholder="" limit={255} value={shelf.description} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </>
  )
}

export default EditShelf