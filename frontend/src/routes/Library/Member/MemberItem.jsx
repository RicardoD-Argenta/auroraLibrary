import { Link, useNavigate } from 'react-router-dom'
import styles from './MemberItem.module.css'

// imports
import ListActions from '../../../components/lists/ListActions'
import { GRADES } from '../../../components/form/ClassSelect'

// hooks
import useMember from '../../../hooks/useMember'

function decodeClass(val) {
    if (!val) return ''
    const lastChar = val.slice(-1)
    const hasLetter = /[A-Z]/.test(lastChar)
    const grade = hasLetter ? val.slice(0, -1) : val
    const letter = hasLetter ? lastChar : ''
    const gradeEntry = GRADES.find(g => g.value === grade)
    if (!gradeEntry) return val
    return letter ? `${gradeEntry.label} - ${letter}` : gradeEntry.label
}

function formatDate(val) {
    if (!val) return ''
    return new Date(val).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}


const MemberItem = ({ item, onDeleteSuccess }) => {
    const { deleteMember } = useMember()
    const navigate = useNavigate()

    async function handleDelete(memberId) {
        await deleteMember(memberId)
        if (onDeleteSuccess) onDeleteSuccess()
    }

    async function handleEdit(memberId) {
        navigate(`/library/member/edit?id=${memberId}`)
    }

    return (
        <li>
            <div className={styles.itemContainer}>
                <div className={styles.contentContainer}>
                    <span className={styles.code}>ID: {item.code}</span>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Nome:</span>
                        <span className={styles.name}>{item.name}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.name}>{item.email ? item.email : 'Não definido'}</span>
                    </div>
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Telefone:</span>
                        <span className={styles.name}>{item.phone ? item.phone : 'Não definido'}</span>
                    </div>
                    {item.student.isStudent && (
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Classe:</span>
                            <span className={styles.name}>{decodeClass(item.student.studentClass)}</span>
                        </div>
                    )}
                    {item.member.isMember && (
                        <div className={styles.labelContainer}>
                            <span className={styles.label}>Data de entrada:</span>
                            <span className={styles.name}>{formatDate(item.member.memberSince)}</span>
                        </div>
                    )}
                    <div className={styles.labelContainer}>
                        <span className={styles.label}>Observações:</span>
                        <span className={styles.name}>{item.observations ? item.observations : 'Não definido'}</span>
                    </div>
                </div>
                <div className={styles.actionsContainer}>
                    <ListActions onDelete={() => handleDelete(item._id) } onEdit={() => handleEdit(item._id)} />
                </div>
            </div>
        </li>
    )
}

export default MemberItem
