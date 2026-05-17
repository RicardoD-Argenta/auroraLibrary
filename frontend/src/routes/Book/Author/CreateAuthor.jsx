import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthor from '../../../hooks/useAuthor'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'

import styles from '../../../components/form/Form.module.css'

const CreateAuthor = () => {
    const { createAuthor, loading } = useAuthor()
    const navigate = useNavigate()

    const [author, setAuthor] = useState({
        name: ''
    })

    function handleChange(e) {
        setAuthor({ ...author, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newAuthor = await createAuthor(author)
        setAuthor({ name: '' })
        navigate('/book/author/edit?id=' + newAuthor._id)
    }

  return (
    <div>
        <PageHeader title="Novo autor">
            <Button variant="submit" type="submit" form="create-author-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-author-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome" type="text" id="name" name="name" placeholder="" limit={255} value={author.name} handleOnChange={handleChange} />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreateAuthor