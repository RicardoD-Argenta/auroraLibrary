import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useBook() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createBook(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/book/book/register', data))
            toast.success(res.data.message ?? 'Livro criado com sucesso!')
            return res.data.book
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getBooks(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/book/book/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteBook(bookId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/book/book/${bookId}`))
            toast.success(res.data.message ?? 'Livro excluído com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getBook(bookId) {
        try {
            setLoading(true)
            const res = await api.get(`/book/book/${bookId}`)
            return res.data.book
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editBook(bookId, data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/book/book/${bookId}`, data))
            toast.success(res.data.message ?? 'Livro atualizado com sucesso!')
            return res.data.book
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }


    return { createBook, getBooks, deleteBook, getBook, editBook, loading }
}