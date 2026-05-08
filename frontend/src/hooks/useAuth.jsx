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

    async function register(user) {
        try {
            setLoading(true)
            const data = await api.post('/auth/register', user).then((res) => {
                return res.data
            })
            setLoading(false)
            setError(null)
        } catch (err) {
            setError(err.response?.data?.message)
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
    return { authenticated, user, authLoading, register, login, logout, loading, error }
}
