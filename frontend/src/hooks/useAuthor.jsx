import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useAuthor() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createAuthor(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/book/author/register', data))
            toast.success(res.data.message ?? 'Autor criado com sucesso!')
            return res.data.author
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getAuthors(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/book/author/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteAuthor(authorId) {
            try {
                setLoading(true)
                const res = await toast.promise(api.delete(`/book/author/${authorId}`))
                toast.success(res.data.message ?? 'Autor excluído com sucesso!')
                return res.data
            } catch (err) {
                throw err
            } finally {
                setLoading(false)
            }
    }

    async function getAuthor(authorId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.get(`/book/author/${authorId}`))
            return res.data.author
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editAuthor(authorData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/book/author/${authorData._id}`, authorData))
            toast.success(res.data.message ?? 'Autor atualizado com sucesso!')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createAuthor, getAuthors, getAuthor, editAuthor, deleteAuthor, loading }
}