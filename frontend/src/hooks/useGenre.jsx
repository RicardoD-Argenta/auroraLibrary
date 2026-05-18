import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useGenre() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createGenre(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/book/genre/register', data))
            toast.success(res.data.message ?? 'Gênero criado com sucesso!')
            return res.data.genre
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getGenres(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/book/genre/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteGenre(genreId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/book/genre/${genreId}`))
            toast.success(res.data.message ?? 'Gênero deletado com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getGenre(genreId) {
        try {
            setLoading(true)
            const res = await api.get(`/book/genre/${genreId}`)
            return res.data.genre
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editGenre(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/book/genre/${data._id}`, data))
            toast.success(res.data.message ?? 'Gênero atualizado com sucesso!')
            return res.data.genre
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createGenre, getGenres, getGenre, editGenre, deleteGenre, loading }
}