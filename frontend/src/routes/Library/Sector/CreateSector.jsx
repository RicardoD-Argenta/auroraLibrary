import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSector from '../../../hooks/useSector'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'

import styles from '../../../components/form/Form.module.css'

const CreateSector = () => {
    const { createSector, loading } = useSector()
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
        const newSector = await createSector(sector)
        setSector({ name: '', description: '' })
        navigate(`/library/sector/edit?id=${newSector._id}`)
    }

  return (
    <div>
        <PageHeader title="Novo setor">
            <Button variant="submit" type="submit" form="create-sector-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-sector-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome" type="text" id="name" name="name" placeholder="" limit={255} value={sector.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Descrição" type="text" id="description" name="description" placeholder="" limit={255} value={sector.description} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreateSector