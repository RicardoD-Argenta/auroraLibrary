import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth'

// Components
import Input from '../../../components/form/Input'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'

import styles from '../../../components/form/Form.module.css'

const CreateUser = () => {
    const { createUser, loading } = useAuth()
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name: '',
        login: '',
        password: '',
        confirmPassword: '',
        role: ''
    })

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newUser = await createUser(user)
        setUser({ name: '', login: '', password: '', confirmPassword: '', role: '' })
        navigate(`/user/edit?id=${newUser._id}`)
    }

  return (
    <div>
        <PageHeader title="Novo usuário">
            <Button variant="submit" type="submit" form="create-user-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-user-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={user.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Login *" type="text" name="login" placeholder="" limit={255} value={user.login} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Senha *" type="password" name="password" placeholder="" min={6} limit={255} value={user.password} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Contra-senha *" type="password" name="confirmPassword" placeholder="" min={6} limit={255} value={user.confirmPassword} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <EnumSelect
                            text="Função *"
                            name="role"
                            value={user.role}
                            handleOnChange={handleChange}
                            options={[
                                { label: 'Bibliotecário', value: 'librarian' },
                                { label: 'Administrador', value: 'admin' },
                            ]}
                        />
                    </div>
                </div>
            </form>
        </section>
    </div>
  )
}

export default CreateUser