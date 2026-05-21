import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useMember from '../../../hooks/useMember'


// Components
import Input from '../../../components/form/Input'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import ParamField from '../../../components/form/ParamField'
import ClassSelect from '../../../components/form/ClassSelect'

import styles from '../../../components/form/Form.module.css'

const CreateMember = () => {
    const { createMember, loading } = useMember()
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
            observations: member.observations
        }
        const newMember = await createMember(payload)
        setMember(initialState)
        navigate(`/library/member/edit?id=${newMember._id}`)
    }

  return (
    <div>
        <PageHeader title="Novo membro">
            <Button variant="submit" type="submit" form="create-member-form">Salvar</Button>
        </PageHeader>
        <section className={styles['form-container']}>
            <form id="create-member-form" onSubmit={handleSubmit}>
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

export default CreateMember