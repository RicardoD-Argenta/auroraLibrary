import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLoan from '../../../hooks/useLoan'
import { formatMember } from '../../../utils/formatMember'

// Components
import Input from '../../../components/form/Input'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const STATUS_OPTIONS = [
    { label: 'Ativo', value: 'active' },
    { label: 'Devolvido', value: 'returned' },
    { label: 'Atrasado', value: 'overdue' },
    { label: 'Perdido', value: 'lost' },
]

const CONDITION_OPTIONS = [
    { label: 'Não definido', value: '' },
    { label: 'Novo', value: 'new' },
    { label: 'Bom', value: 'good' },
    { label: 'Desgastado', value: 'worn' },
    { label: 'Danificado', value: 'damaged' },
]

const CONDITION_LABEL = { new: 'Novo', good: 'Bom', worn: 'Desgastado', damaged: 'Danificado' }

function convertDate(raw) {
    if (!raw) return undefined
    const [y, m, d] = raw.split('-')
    return `${m}-${d}-${y}`
}

function toInputDate(val) {
    if (!val) return ''
    return new Date(val).toISOString().slice(0, 10)
}

const EditLoan = () => {
    const { getLoan, editLoan, deleteLoan, loading } = useLoan()
    const navigate = useNavigate()

    const [loan, setLoan] = useState({
        _id: '',
        code: '',
        bookLabel: '',
        memberLabel: '',
        operatorName: '',
        loanDate: '',
        conditionOut: '',
        dueDate: '',
        returnDate: '',
        conditionIn: '',
        status: '',
        notes: '',
    })

    const [showConfirm, setShowConfirm] = useState(false)

    function handleChange(e) {
        setLoan(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            notes: loan.notes,
            dueDate: convertDate(loan.dueDate),
            returnDate: convertDate(loan.returnDate),
            conditionIn: loan.conditionIn,
            status: loan.status,
        }
        await editLoan(loan._id, payload)
    }

    async function handleDelete() {
        await deleteLoan(loan._id)
        navigate('/loan/list')
    }

    useEffect(() => {
        const loanId = new URLSearchParams(window.location.search).get('id')
        if (loanId) {
            const fetchLoan = async () => {
                try {
                    const data = await getLoan(loanId)
                    setLoan({
                        _id: data._id,
                        code: data.code ?? '',
                        bookLabel: `${data.copyId?.bookId?.title ?? ''} | ${data.copyId?.copycode ?? ''}`,
                        memberLabel: formatMember(data.memberId),
                        operatorName: data.operatorId?.name ?? '',
                        loanDate: toInputDate(data.loanDate),
                        conditionOut: CONDITION_LABEL[data.conditionOut] ?? data.conditionOut ?? '',
                        dueDate: toInputDate(data.dueDate),
                        returnDate: toInputDate(data.returnDate),
                        conditionIn: data.conditionIn ?? '',
                        status: data.status ?? '',
                        notes: data.notes ?? '',
                    })
                } catch {
                    navigate('/loan/list')
                }
            }
            fetchLoan()
        } else {
            navigate('/loan/list')
        }
    }, [])

    if (loading) return <div>Carregando...</div>

    return (
        <div>
            <PageHeader title={'Editar Empréstimo'}>
                <Button onClick={() => navigate('/loan/register')}>Criar empréstimo</Button>
                <Button variant="danger" onClick={() => setShowConfirm(true)}>Deletar Registro</Button>
                <Button variant="submit" type="submit" form="edit-loan-form">Salvar</Button>
            </PageHeader>
            {showConfirm && (
                <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
            )}
            <section className={styles['form-container']}>
                <form id="edit-loan-form" onSubmit={handleSubmit}>
                    <div className={styles['form-control']}>
                        <div className={styles['input-wrapper']}>
                            <Input text="ID" type="text" name="id" placeholder="" limit={20} value={loan.code} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Exemplar" type="text" name="bookLabel" value={loan.bookLabel} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Membro" type="text" name="memberLabel" value={loan.memberLabel} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Operador" type="text" name="operatorName" value={loan.operatorName} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Data do empréstimo" type="date" name="loanDate" value={loan.loanDate} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Condição do exemplar no empréstimo" type="text" name="conditionOut" value={loan.conditionOut} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Prazo para devolução *" type="date" name="dueDate" value={loan.dueDate} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Data de devolução" type="date" name="returnDate" value={loan.returnDate} handleOnChange={handleChange} {...(loan.status !== 'returned' ? { disabled: true } : {})} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <EnumSelect text="Condição do exemplar na devolução" name="conditionIn" value={loan.conditionIn} handleOnChange={(e) => setLoan(prev => ({ ...prev, conditionIn: e.target.value }))} options={CONDITION_OPTIONS} {...(loan.status !== 'returned' ? { disabled: true } : {})}/>
                        </div>
                        <div className={styles['input-wrapper']}>
                            <EnumSelect text="Status *" name="status" value={loan.status} handleOnChange={(e) => setLoan(prev => ({ ...prev, status: e.target.value }))} options={STATUS_OPTIONS} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Notas" type="textarea" name="notes" placeholder="" limit={500} value={loan.notes} handleOnChange={handleChange} />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default EditLoan
