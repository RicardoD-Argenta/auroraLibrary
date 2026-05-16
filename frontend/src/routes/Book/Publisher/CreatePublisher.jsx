import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePublisher from '../../../hooks/usePublisher'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'

import styles from '../../../components/form/Form.module.css'

const CreatePublisher = () => {
    const { createPublisher, loading } = usePublisher()
    const navigate = useNavigate()

    const [publisher, setPublisher] = useState({
        name: ''
    })

    function handleChange(e) {
        setPublisher({ ...publisher, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newPublisher = await createPublisher(publisher)
        setPublisher({ name: '' })
        navigate('/book/publisher/edit?id=' + newPublisher._id)
    }

  return (
    <div>
        <PageHeader title="Nova editora">
            <Button variant="submit" type="submit" form="create-publisher-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-publisher-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome" type="text" id="name" name="name" placeholder="" limit={255} value={publisher.name} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreatePublisher