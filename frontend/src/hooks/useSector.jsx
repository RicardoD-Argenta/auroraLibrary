import { useState } from 'react'
import api from '../utils/api'
import useToast from './useToast'

export default function useSector() {
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    async function createSector(data) {
        try {
            setLoading(true)
            const res = await toast.promise(api.post('/library/sector/register', data))
            toast.success(res.data.message ?? 'Setor criado com sucesso!')
            return res.data.sector
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getSectors(page = 1, search = '') {
        try {
            setLoading(true)
            const res = await api.get('/library/sector/all', {
                params: { page, search }
            })
            return res.data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function deleteSector(sectorId) {
        try {
            setLoading(true)
            const res = await toast.promise(api.delete(`/library/sector/${sectorId}`))
            toast.success(res.data.message ?? 'Setor deletado com sucesso!')
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function getSector(sectorId) {
        try {
            setLoading(true)
            const res = await api.get(`/library/sector/${sectorId}`)
            return res.data.sector
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }


    async function editSector(sectorData) {
        try {
            setLoading(true)
            const res = await toast.promise(api.patch(`/library/sector/${sectorData._id}`, sectorData))
            toast.success(res.data.message ?? 'Setor atualizado com sucesso!')
            return res.data.sector
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { createSector, getSectors, getSector, editSector, deleteSector, loading }
}