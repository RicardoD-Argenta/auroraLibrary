import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../../hooks/useAuth'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditUser = () => {

    const { getUser, editUser, deleteUser, loading } = useAuth()
    const navigate = useNavigate()
    
    const [user, setUser] = useState({
        name: '',
        login: '',
        password: '',
        oldPassword: '',
        role: ''
    })

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await editUser(user)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteUser(user._id)
        navigate('/user/list')
    }

    useEffect(() => {
        const userId = new URLSearchParams(window.location.search).get('id')
        if (userId) {
            const fetchUser = async () => {
                try {
                    const data = await getUser({ id: userId })
                    setUser(data.user)
                } catch {
                    navigate('/user/list')
                }
            }
            fetchUser()
        } else {
            navigate('/user/list')
        }
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar usuário">
            <Button onClick={() => navigate('/user/register')}>Criar novo usuário</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-user-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-user-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={user.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Login *" type="text" name="login" placeholder="" limit={255} value={user.login} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Senha" type="password" name="password" placeholder="" min={6} limit={255} value={user.password} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Senha atual" type="password" name="oldPassword" placeholder="" min={6} limit={255} value={user.oldPassword} handleOnChange={handleChange} />
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
    </>
  )
}

export default EditUser