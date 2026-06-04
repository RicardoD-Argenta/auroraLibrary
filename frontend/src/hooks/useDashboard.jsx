import { useState } from 'react'
import api from '../utils/api'

export default function useDashboard() {
    const [loading, setLoading] = useState(false)

    async function getDashboard() {
        try {
            setLoading(true)
            const res = await api.get('/dashboard')
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { getDashboard, loading }
}
