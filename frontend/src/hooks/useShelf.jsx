import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useShelf() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createShelf(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/library/shelf/register', data))
            toast.success(res.data.message ?? 'Prateleira criada com sucesso!')
            return res.data.shelf
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getShelves(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/library/shelf/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteShelf(shelfId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/library/shelf/${shelfId}`))
            toast.success(res.data.message ?? 'Prateleira deletada com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getShelf(shelfId) {
        try {
            setLoading(true)
            const res = await api.get(`/library/shelf/${shelfId}`)
            return res.data.shelf
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editShelf(shelfData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/library/shelf/${shelfData._id}`, shelfData))
            toast.success(res.data.message ?? 'Prateleira atualizada com sucesso!')
            return res.data.shelf
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createShelf, getShelves, getShelf, editShelf, deleteShelf, loading }
}