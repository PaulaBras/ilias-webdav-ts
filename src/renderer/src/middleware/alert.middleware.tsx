import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    pauseOnFocusLoss: true,
    theme: 'light',
};

export const alert = {
    success: (message: string, header?: string) => {
        toast.success(message, {
            ...toastOptions,
            ...(header && { title: header }),
        });
    },
    warning: (message: string, header?: string) => {
        toast.warning(message, {
            ...toastOptions,
            ...(header && { title: header }),
        });
    },
    error: (message: string, header?: string) => {
        toast.error(message, {
            ...toastOptions,
            ...(header && { title: header }),
        });
    },
    promise: (promise: Promise<any>, successMessage: string, errorMessage: string, header?: string) => {
        promise
            .then(() => {
                alert.success(successMessage, header);
            })
            .catch(() => {
                alert.error(errorMessage, header);
            });
    },
};