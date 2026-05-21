import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useMember from '../../../hooks/useMember'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import ParamField from '../../../components/form/ParamField'
import ClassSelect from '../../../components/form/ClassSelect'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditMember = () => {
    const { getMember, updateMember, deleteMember, loading } = useMember()
    const navigate = useNavigate()

    const initialState = {
        name: '',
        email: '',
        phone: '',
        student: { active: false, studentClass: '' },
        member: { active: false, memberSince: '' },
        observations: ''
    }

    const [member, setMember] = useState(initialState)

    function handleChange(e) {
        setMember(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleParamChange(paramKey, val) {
        setMember(prev => ({ ...prev, [paramKey]: val }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const rawDate = member.member.memberSince
        const memberSince = rawDate ? (() => { const [y, m, d] = rawDate.split('-'); return `${m}-${d}-${y}` })() : undefined

        const payload = {
            _id: member._id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            student: {
                isStudent: member.student.active,
                studentClass: member.student.studentClass,
            },
            member: {
                isMember: member.member.active,
                memberSince,
            },
            observations: member.observations,
        }
        await updateMember(payload)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    async function handleDelete() {
        await deleteMember(member._id)
        navigate('/library/member/list')
    }

    useEffect(() => {
            const memberId = new URLSearchParams(window.location.search).get('id')
            if (memberId) {
                const fetchMember = async () => {
                    try {
                        const data = await getMember(memberId)
                        setMember({
                            _id: data._id,
                            name: data.name ?? '',
                            email: data.email ?? '',
                            phone: data.phone ?? '',
                            student: {
                                active: data.student?.isStudent ?? false,
                                studentClass: data.student?.studentClass ?? '',
                            },
                            member: {
                                active: data.member?.isMember ?? false,
                                memberSince: data.member?.memberSince
                                    ? new Date(data.member.memberSince).toISOString().slice(0, 10)
                                    : '',
                            },
                            observations: data.observations ?? '',
                        })
                    } catch {
                        navigate('/library/member/list')
                    }
                }
                fetchMember()
            } else {
                navigate('/library/member/list')
            }
        }, [])
    
    
        if (loading) return <div>Carregando...</div>

  return (
    <div>
        <PageHeader title="Editar membro">
            <Button onClick={() => navigate('/library/member/register')}>Criar novo membro</Button>
            <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
            <Button variant="submit" type="submit" form="edit-member-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-member-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={member.name} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Email" type="email" name="email" placeholder="" limit={255} value={member.email} handleOnChange={handleChange} />
                    </div>
                    <div className={styles['input-wrapper']}>
                        <Input text="Telefone" type="tel" name="phone" value={member.phone} handleOnChange={handleChange} phone />
                    </div>
                </div>
                <ParamField
                    label="É estudante?"
                    value={member.student}
                    onChange={(val) => handleParamChange('student', val)}
                    fields={[
                        { name: 'studentClass', component: ClassSelect }
                    ]}
                />
                <ParamField
                    label="É membro?"
                    value={member.member}
                    onChange={(val) => handleParamChange('member', val)}
                    fields={[
                        { name: 'memberSince', label: 'Membro desde', type: 'date' }
                    ]}
                />
                <div className={styles['input-wrapper']}>
                    <Input text="Observações" type="textarea" name="observations" placeholder="" limit={255} value={member.observations} handleOnChange={handleChange} />
                </div>
            </form>
        </section>
    </div>
  )
}

export default EditMember