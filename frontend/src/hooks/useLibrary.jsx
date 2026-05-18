import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useLibrary() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function getLibrary() {
        try {
            setLoading(true)
            const res = await api.get(`/library/library`)
            const params = res.data.libraryParams?.params ?? {
                isSchool: { active: false },
                loanDelay: { active: false, dailyRate: null, fineValue: null }
            }
            if (params.loanDelay?.dailyRate != null) {
                params.loanDelay.dailyRate = String(params.loanDelay.dailyRate)
            }
            if (params.loanDelay?.fineValue != null) {
                params.loanDelay.fineValue = String(params.loanDelay.fineValue)
            }
            return { ...res.data.library, params }
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }


    async function editLibrary(libraryData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/library/library`, libraryData))
            toast.success(res.data.message ?? 'Biblioteca atualizada com sucesso!')
            return res.data.library
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { getLibrary, editLibrary, loading }
}