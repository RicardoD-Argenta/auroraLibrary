import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePublisher from '../../../hooks/usePublisher'
import ConfirmModal from '../../../components/lists/ConfirmModal'


// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import PageHeader from '../../../components/layout/PageHeader'

import styles from '../../../components/form/Form.module.css'

const EditPublisher = () => {

    const { getPublisher, editPublisher, deletePublisher, loading } = usePublisher()
    const navigate = useNavigate()
    
    const [publisher, setPublisher] = useState({
        name: ''
    })

    function handleChange(e) {
        setPublisher({ ...publisher, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await editPublisher(publisher)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deletePublisher(publisher._id)
        navigate('/book/publisher/list')
    }

    useEffect(() => {
        const publisherId = new URLSearchParams(window.location.search).get('id')
        if (publisherId) {
            const fetchPublisher = async () => {
                try {
                    const publisher = await getPublisher(publisherId)
                    setPublisher(publisher)
                } catch {
                    navigate('/book/publisher/list')
                }
            }
            fetchPublisher()
        } else {
            navigate('/book/publisher/list')
        }
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar editora">
            <Button onClick={() => navigate('/book/publisher/register')}>Criar nova editora</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-publisher-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-publisher-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="ID" type="text" name="id" placeholder="" limit={20} value={publisher.code} disabled />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome" type="text" name="name" placeholder="" limit={255} value={publisher.name} handleOnChange={handleChange} />
                    </div>
                    
                </div>
            </form>
        </section>
    </>
  )
}

export default EditPublisher