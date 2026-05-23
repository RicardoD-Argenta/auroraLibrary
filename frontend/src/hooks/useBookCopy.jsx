import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useBookCopy() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createBookCopy(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/book/bookcopy/register', data))
            toast.success(res.data.message ?? 'Exemplar criado com sucesso!')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getBookCopies(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/book/bookcopy/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteBookCopy(bookCopyId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/book/bookcopy/${bookCopyId}`))
            toast.success(res.data.message ?? 'Exemplar excluído com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getBookCopy(bookCopyId) {
        try {
            setLoading(true)
            const res = await api.get(`/book/bookcopy/${bookCopyId}`)
            return res.data.bookCopy
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editBookCopy(bookCopyId, data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/book/bookcopy/${bookCopyId}`, data))
            toast.success(res.data.message ?? 'Exemplar atualizado com sucesso!')
            return res.data.bookCopy
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }


    return { createBookCopy, getBookCopies, deleteBookCopy, getBookCopy, editBookCopy, loading }
}