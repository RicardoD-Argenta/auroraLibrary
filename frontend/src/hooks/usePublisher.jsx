import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function usePublisher() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createPublisher(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/book/publisher/register', data))
            toast.success(res.data.message ?? 'Editora criada com sucesso!')
            return res.data.publisher
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getPublishers(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/book/publisher/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deletePublisher(publisherId) {
            try {
                setLoading(true)
                const res = await toast.promise(api.delete(`/book/publisher/${publisherId}`))
                toast.success(res.data.message ?? 'Editora excluída com sucesso!')
                return res.data
            } catch (err) {
                throw err
            } finally {
                setLoading(false)
            }
    }

    async function getPublisher(publisherId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.get(`/book/publisher/${publisherId}`))
            return res.data.publisher
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editPublisher(publisherData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/book/publisher/${publisherData._id}`, publisherData))
            toast.success(res.data.message ?? 'Editora atualizada com sucesso!')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createPublisher, getPublishers, getPublisher, deletePublisher, editPublisher, loading }
}