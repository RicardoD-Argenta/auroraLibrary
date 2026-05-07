// api
import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useToast from './useToast'

export default function useAuth() {
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
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
        setAuthenticated(true)

        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/', { state: { message: data.message } })
    }

    async function logout() {
        localStorage.removeItem('token')
        setAuthenticated(false)
        api.defaults.headers.Authorization = null
        navigate('/login')
        toast.success('Sessão encerrada com sucesso')
    }
    return { authenticated, register, login, logout, loading, error }
}
