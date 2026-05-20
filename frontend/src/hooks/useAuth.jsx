// api
import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useToast from './useToast'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.user)
                    setAuthenticated(true)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    api.defaults.headers.Authorization = null
                })
                .finally(() => setAuthLoading(false))
        } else {
            setAuthLoading(false)
        }
    }, [])

    async function createUser(user) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/auth/register', user))
            toast.success(res.data.message ?? 'Usuário criado com sucesso!')
            return res.data.user
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function login(user) {
        try {
            setLoading(true)
            const data = await toast.promise(
                api.post('/auth/login', user).then((res) => res.data)
            )
            await authUser(data)
            setLoading(false)
            setError(null)
        } catch (error) {
            const message = error.response?.data?.message
            const err = error.response?.data?.err
            setError(message)
            setLoading(false)
            return { message, err }
        }
    }

    async function getUsers(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/auth/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteUser(id) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/auth/${id}`))
            toast.success(res.data.message ?? 'Usuário deletado com sucesso!')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getUser(userData) {
        try {
            setLoading(true)
            const res = await api.get(`/auth/${userData.id}`)
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function editUser(userData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/auth/${userData._id}`, userData))
            toast.success(res.data.message ?? 'Usuário atualizado com sucesso!')
            return res.data.user
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function authUser(data) {
        localStorage.setItem('token', JSON.stringify(data.token))
        api.defaults.headers.Authorization = `Bearer ${data.token}`

        const me = await api.get('/auth/me')
        setUser(me.data.user)
        setAuthenticated(true)

        navigate('/', { state: { message: data.message } })
    }

    async function logout() {
        localStorage.removeItem('token')
        setAuthenticated(false)
        setUser(null)
        api.defaults.headers.Authorization = null
        navigate('/login')
        toast.success('Sessão encerrada com sucesso')
    }
    return { authenticated, user, authLoading, createUser, getUsers, getUser, deleteUser, editUser, login, logout, loading, error }
}
