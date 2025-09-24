import React from 'react';
import { cn } from '@/utils/cn';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Info,
    X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose: (id: string) => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    id,
    type,
    message,
    onClose,
    duration = 5000,
}) => {
    React.useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const colors = {
        success:
            'bg-success-50 border-success-200 text-success-800',
        error: 'bg-error-50 border-error-200 text-error-800',
        warning:
            'bg-warning-50 border-warning-200 text-warning-800',
        info: 'bg-accent-50 border-accent-200 text-accent-800',
    };

    const iconColors = {
        success: 'text-success-500',
        error: 'text-error-500',
        warning: 'text-warning-500',
        info: 'text-accent-500',
    };

    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 0.5,
                transition: { duration: 0.2 },
            }}
            className={cn(
                'flex items-center p-4 rounded-lg border shadow-medium max-w-sm w-full',
                colors[type]
            )}
        >
            <Icon
                className={cn(
                    'h-5 w-5 mr-3 flex-shrink-0',
                    iconColors[type]
                )}
            />
            <p className="text-sm font-medium flex-1">
                {message}
            </p>
            <button
                onClick={() => onClose(id)}
                className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }>;
    onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
    toasts,
    onClose,
}) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={onClose}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export { Toast, ToastContainer };
