import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoanItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'
import { formatMember } from '../../../utils/formatMember'

// hooks
import useLoan from '../../../hooks/useLoan'

const LoanItem = ({ item, onClick, onDeleteSuccess }) => {
    const { deleteLoan } = useLoan()
    const navigate = useNavigate()

    function formatDate(val) {
        if (!val) return ''
        return new Date(val).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    async function handleDelete(loanId) {
        await deleteLoan(loanId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(loanId) {
        navigate(`/loan/edit?id=${loanId}`)
    }

    const STATUS_LABEL = { active: 'Ativo', returned: 'Devolvido', overdue: 'Atrasado', lost: 'Perdido' }
    const CONDITION_LABEL = { new: 'Novo', good: 'Bom', worn: 'Desgastado', damaged: 'Danificado' }

    const status = STATUS_LABEL[item.status] ?? item.status

    return (
        <li>
            <div className={styles.itemContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.code}>ID: {item.code}</span>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.name}>{status}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Exemplar:</span>
                        <span className={styles.name}>{item.copyId?.bookId?.title ?? item.copyId}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Código do exemplar:</span>
                        <span className={styles.name}>{item.copyId?.copycode}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Membro:</span>
                        <span className={styles.name}>{formatMember(item.memberId)}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Emprestado por:</span>
                        <span className={styles.name}>{item.operatorId?.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>data de empréstimo:</span>
                        <span className={styles.name}>{formatDate(item.loanDate)}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Limite para devolução:</span>
                        <span className={styles.name}>{formatDate(item.dueDate)}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Devolvido em:</span>
                        <span className={styles.name}>{item.returnDate ? formatDate(item.returnDate) : 'Não devolvido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Notas:</span>
                        <span className={styles.name}>{item.notes ? item.notes : 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Condição de empréstimo:</span>
                        <span className={styles.name}>{CONDITION_LABEL[item.conditionOut] ?? item.conditionOut}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelVariant}>Condição do devolução:</span>
                        <span className={styles.name}>{item.conditionIn ? (CONDITION_LABEL[item.conditionIn] ?? item.conditionIn) : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default LoanItem
