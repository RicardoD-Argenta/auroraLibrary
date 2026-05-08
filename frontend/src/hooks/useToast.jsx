import { toast } from 'react-toastify'

const toastConfig = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
}

export default function useToast() {

    function success(message) {
        toast.success(message, toastConfig)
    }

    function error(message) {
        toast.error(message, toastConfig)
    }

    async function promise(fn) {
        try {
            return await fn
        } catch (err) {
            error(err.response?.data?.message ?? 'Erro inesperado')
            throw err
        }
    }

    return { success, error, promise }
}
