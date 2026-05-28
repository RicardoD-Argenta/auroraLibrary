import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useLibrary from '../../../hooks/useLibrary'

// Components
import Input from '../../../components/form/Input'
import Button from '../../../components/form/Button'
import ParamField from '../../../components/form/ParamField'
import PageHeader from '../../../components/layout/PageHeader'
import ConfirmModal from '../../../components/lists/ConfirmModal'

import styles from '../../../components/form/Form.module.css'

const EditLibrary = () => {

    const { getLibrary, editLibrary, loading } = useLibrary()
    const navigate = useNavigate()
    
    const [library, setLibrary] = useState({
        name: '',
        params: {
            isSchool: { active: false },
            loanDelay: { active: false, dailyRate: null, fineValue: null }
        }
    })

    function handleChange(e) {
        setLibrary({ ...library, [e.target.name]: e.target.value })
    }

    function handleParamChange(paramKey, val) {
        setLibrary(prev => ({ ...prev, params: { ...prev.params, [paramKey]: val } }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const normNum = (v) => v != null ? String(v).replace(',', '.') : v
        const payload = {
            ...library,
            params: {
                ...library.params,
                loanDelay: {
                    ...library.params.loanDelay,
                    dailyRate: normNum(library.params.loanDelay.dailyRate),
                    fineValue: normNum(library.params.loanDelay.fineValue),
                }
            }
        }
        await editLibrary(payload)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const library = await getLibrary()
                setLibrary(library)
            } catch {
                navigate('/')
            }
        }
        fetchLibrary()
    }, [])


    if (loading) return <div>Carregando...</div>

  return (
    <>
        <PageHeader title="Editar biblioteca">
            <Button variant="submit" type="submit" form="edit-library-form">Salvar</Button>
        </PageHeader>
        {showConfirm && (
            <ConfirmModal onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
        )}
        <section className={styles['form-container']}>
            <form id="edit-library-form" onSubmit={handleSubmit}>
                <div className={styles['form-control']}>
                    <div className={styles['input-wrapper']}>
                        <Input text="Nome *" type="text" name="name" placeholder="" limit={255} value={library.name} handleOnChange={handleChange} />
                    </div>
                </div>
                <ParamField
                    label="É escola?"
                    value={library.params.isSchool}
                    onChange={(val) => handleParamChange('isSchool', val)}
                />
                <ParamField
                    label="Atraso de empréstimo"
                    value={library.params.loanDelay}
                    onChange={(val) => handleParamChange('loanDelay', val)}
                    fields={[
                        { name: 'dailyRate', label: 'Taxa diária (%)', number: true, limit: 3 },
                        { name: 'fineValue', label: 'Multa base (R$)', number: true, limit: 10 },
                    ]}
                />
            </form>
        </section>
    </>
  )
}

export default EditLibrary