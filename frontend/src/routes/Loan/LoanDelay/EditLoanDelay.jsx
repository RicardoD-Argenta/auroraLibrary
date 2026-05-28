import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLoanDelay from '../../../hooks/useLoanDelay'
import { formatMember } from '../../../utils/formatMember'

// Components
import Input from '../../../components/form/Input'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import ConfirmModal from '../../../components/lists/ConfirmModal'
import ParamField from '../../../components/form/ParamField'

import styles from '../../../components/form/Form.module.css'

function convertDate(raw) {
    if (!raw) return undefined
    const [y, m, d] = raw.split('-')
    return `${m}-${d}-${y}`
}

function toInputDate(val) {
    if (!val) return ''
    return new Date(val).toISOString().slice(0, 10)
}

const EditLoanDelay = () => {
    const { getLoanDelay, editLoanDelay, loading } = useLoanDelay()
    const navigate = useNavigate()

    const [loanDelay, setLoanDelay] = useState({
        _id: '',
        code: '',
        loanId: '',
        overdueDays: '',
        overdueFee: '',
        paid: { active: false, paidAt: '' },
    })

    function handleChange(e) {
        setLoanDelay(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            paid: loanDelay.paid.active,
            paidAt: convertDate(loanDelay.paid.paidAt),
        }
        await editLoanDelay(loanDelay._id, payload)
        if (payload.paid === true) {
            navigate(`/loan/edit?id=${loanDelay.loanId}`)
        }
    }

    useEffect(() => {
        const loanId = new URLSearchParams(window.location.search).get('id')
        if (loanId) {
            const fetchLoan = async () => {
                try {
                    const data = await getLoanDelay(loanId)
                    setLoanDelay({
                        _id: data._id,
                        code: data.code,
                        loanId: data.loanId._id,
                        loanCode: data.loanId.code,
                        overdueDays: data.overdueDays,
                        overdueFee: data.overdueFee,
                        paid: { active: data.paid, paidAt: toInputDate(data.paidAt) },
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
                <Button onClick={() => navigate('/loan/list')}>Voltar</Button>
                <Button variant="submit" type="submit" form="edit-loan-form">Salvar</Button>
            </PageHeader>
            <section className={styles['form-container']}>
                <form id="edit-loan-form" onSubmit={handleSubmit}>
                    <div className={styles['form-control']}>
                        <div className={styles['input-wrapper']}>
                            <Input text="ID" type="text" name="id" placeholder="" limit={20} value={loanDelay.code} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="ID do Empréstimo" type="text" name="loanId" placeholder="" limit={20} value={loanDelay.loanCode} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Dias de atraso" type="text" name="overdueDays" placeholder="" limit={20} value={loanDelay.overdueDays} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Taxa de atraso" type="text" name="overdueFee" placeholder="" limit={20} value={`R$ ${loanDelay.overdueFee}`} disabled />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <ParamField
                                label="Pago"
                                value={loanDelay.paid}
                                onChange={(val) => setLoanDelay(prev => ({ ...prev, paid: val }))}
                                fields={[
                                    { name: 'paidAt', label: 'Data de pagamento', type: 'date' },
                                ]}
                            />
                        </div>

                    </div>
                </form>
            </section>
        </div>
    )
}

export default EditLoanDelay
