import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useLoanDelay() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function getLoanDelay(loanId) {
        try {
            setLoading(true)
            const res = await api.get(`/loan/delay/${loanId}`)
            return res.data.loanDelay
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editLoanDelay(loanId, data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/loan/delay/${loanId}`, data))
            toast.success(res.data.message ?? 'Empréstimo atualizado com sucesso!')
            return res.data.loanDelay
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { getLoanDelay, editLoanDelay, loading }
}