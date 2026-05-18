import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useShelf from '../../../hooks/useShelf'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'

import styles from '../../../components/form/Form.module.css'

const CreateShelf = () => {
    const { createShelf, loading } = useShelf()
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
        const newShelf = await createShelf(shelf)
        setShelf({ name: '', description: '' })
        navigate(`/library/shelf/edit?id=${newShelf._id}`)
    }

  return (
    <div>
        <PageHeader title="Nova prateleira">
            <Button variant="submit" type="submit" form="create-shelf-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-shelf-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" id="name" name="name" placeholder="" limit={255} value={shelf.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Descrição" type="text" id="description" name="description" placeholder="" limit={255} value={shelf.description} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreateShelf