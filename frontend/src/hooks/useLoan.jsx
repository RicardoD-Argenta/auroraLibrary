import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useLoan() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createLoan(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/loan/register', data))
            toast.success(res.data.message ?? 'Empréstimo criado com sucesso!')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getLoans(page = 1, search = '', status = '', fromDate = '', toDate = '') {
        try {
            setLoading(true)
            const res = await api.get('/loan/all', {
                params: {
                    page,
                    search,
                    ...(status && { status }),
                    ...(fromDate && { fromDate }),
                    ...(toDate && { toDate })
                }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteLoan(loanId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/loan/${loanId}`))
            toast.success(res.data.message ?? 'Empréstimo excluído com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getLoan(loanId) {
        try {
            setLoading(true)
            const res = await api.get(`/loan/${loanId}`)
            return res.data.loan
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editLoan(loanId, data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/loan/${loanId}`, data))
            toast.success(res.data.message ?? 'Empréstimo atualizado com sucesso!')
            return res.data.loan
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createLoan, getLoans, deleteLoan, getLoan, editLoan, loading }
}