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

    function promise(fn) {
        return toast.promise(fn, {
            pending: 'Carregando...',
            success: null,
            error: {
                render({ data }) {
                    return data.response?.data?.message ?? 'Erro inesperado'
                }
            }
        }, toastConfig)
    }

    return { success, error, promise }
}
