import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useLoan from '../../../hooks/useLoan'
import useBookCopy from '../../../hooks/useBookCopy'
import useMember from '../../../hooks/useMember'
import { UserContext } from '../../../context/UserContext'


// Components
import Input from '../../../components/form/Input'
import EnumSelect from '../../../components/form/EnumSelect'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/form/Button'
import SelectField from '../../../components/form/SelectField'

import BookCopyItem from '../../Book/BookCopy/BookCopyItem'
import MemberItem from '../../Library/Member/MemberItem'
import { formatMember } from '../../../utils/formatMember'

import styles from '../../../components/form/Form.module.css'

const CreateLoan = () => {
    const { createLoan, loading } = useLoan()
    const { getBookCopies } = useBookCopy()
    const { getMembers } = useMember()
    const { auth } = useContext(UserContext)

    const navigate = useNavigate()

    const initialState = {
        bookCopy: null,
        member: null,
        notes: '',
        status: '',
        loanDate: '',
        dueDate: ''
    }

    const [loan, setLoan] = useState(initialState)

    function handleChange(e) {
        setLoan({ ...loan, [e.target.name]: e.target.value })
    }

    function convertDate(raw) {
        if (!raw) return undefined
        const [y, m, d] = raw.split('-')
        return `${m}-${d}-${y}`
    }


    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            copyId: loan.bookCopy?._id,
            memberId: loan.member?._id,
            operatorId: auth.user?._id,
            notes: loan.notes,
            loanDate: convertDate(loan.loanDate),
            dueDate: convertDate(loan.dueDate),
        }
        const newLoan = await createLoan(payload)
        setLoan(initialState)
        navigate(`/loan/edit?id=${newLoan._id}`)
    }

    return (
        <div>
            <PageHeader title="Novo empréstimo">
                <Button variant="submit" type="submit" form="create-loan-form">Salvar</Button>
            </PageHeader>
            <section className={styles['form-container']}>
                <form id="create-loan-form" onSubmit={handleSubmit}>
                    <div className={styles['form-control']}>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Exemplar *"
                                value={loan.bookCopy}
                                onChange={(item) => setLoan({ ...loan, bookCopy: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getBookCopies(page, search, 'available')
                                    return { items: data.bookCopies, pages: data.pages }
                                }}
                                getLabel={(item) => `${item.bookId.title} | ${item.copycode}`}
                                renderItem={(item, onSelect) => <BookCopyItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <SelectField
                                label="Membro *"
                                value={loan.member}
                                onChange={(item) => setLoan({ ...loan, member: item })}
                                fetchItems={async (page, search) => {
                                    const data = await getMembers(page, search)
                                    return { items: data.members, pages: data.pages }
                                }}
                                getLabel={(item) => formatMember(item)}
                                renderItem={(item, onSelect) => <MemberItem key={item._id} item={item} onClick={() => onSelect(item)} />}
                            />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Data do empréstimo *" type="date" name="loanDate" value={loan.loanDate} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Prazo para devolução *" type="date" name="dueDate" value={loan.dueDate} handleOnChange={handleChange} />
                        </div>
                        <div className={styles['input-wrapper']}>
                            <Input text="Notas " type="textarea" name="notes" placeholder="" limit={500} value={loan.notes} handleOnChange={handleChange} />
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CreateLoan