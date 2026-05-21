import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useSector from '../../../hooks/useSector'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditSector = () => {

    const { getSector, editSector, deleteSector, loading } = useSector()
    const navigate = useNavigate()
    
    const [sector, setSector] = useState({
        name: '',
        description: ''
    })

    function handleChange(e) {
        setSector({ ...sector, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await editSector(sector)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteSector(sector._id)
        navigate('/library/sector/list')
    }

    useEffect(() => {
        const sectorId = new URLSearchParams(window.location.search).get('id')
        if (sectorId) {
            const fetchSector = async () => {
                try {
                    const sector = await getSector(sectorId)
                    setSector(sector)
                } catch {
                    navigate('/library/sector/list')
                }
            }
            fetchSector()
        } else {
            navigate('/library/sector/list')
        }
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar setor">
            <Button onClick={() => navigate('/library/sector/register')}>Criar novo setor</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-sector-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-sector-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="ID" type="text" name="id" placeholder="" limit={20} value={sector.code} disabled />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={sector.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Descrição" type="textarea" name="description" placeholder="" limit={255} value={sector.description} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </>
  )
}

export default EditSector