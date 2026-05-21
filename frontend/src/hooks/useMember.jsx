import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useMember() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createMember(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/library/member/register', data))
            toast.success(res.data.message ?? 'Membro criado com sucesso!')
            return res.data.member
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getMembers(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/library/member/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteMember(memberId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/library/member/${memberId}`))
            toast.success(res.data.message ?? 'Membro deletado com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getMember(memberId) {
        try {
            setLoading(true)
            const res = await api.get(`/library/member/${memberId}`)
            return res.data.member
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function updateMember(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/library/member/${data._id}`, data))
            toast.success(res.data.message ?? 'Membro atualizado com sucesso!')
            return res.data.member
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createMember, getMembers, getMember, deleteMember, updateMember, loading }
}