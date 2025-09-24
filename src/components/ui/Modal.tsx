import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener(
                'keydown',
                handleEscape
            );
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener(
                'keydown',
                handleEscape
            );
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={
                    closeOnOverlayClick
                        ? onClose
                        : undefined
                }
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full mx-4 bg-white rounded-xl shadow-strong transform transition-all',
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                        {title && (
                            <h2 className="text-lg font-semibold text-secondary-900">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
};

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn('mb-6', className)}>
            {children}
        </div>
    );
};

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex justify-end space-x-3',
                className
            )}
        >
            {children}
        </div>
    );
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
