import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className,
    text,
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    return (
        <div
            className={cn(
                'flex items-center justify-center',
                className
            )}
        >
            <div className="flex flex-col items-center space-y-2">
                <Loader2
                    className={cn(
                        'animate-spin text-primary-600',
                        sizeClasses[size]
                    )}
                />
                {text && (
                    <p
                        className={cn(
                            'text-secondary-600 font-medium',
                            textSizeClasses[size]
                        )}
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
};

interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    text?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    children,
    text = '로딩 중...',
}) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <LoadingSpinner size="lg" text={text} />
                </div>
            )}
        </div>
    );
};

interface LoadingPageProps {
    text?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
    text = '페이지를 불러오는 중...',
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50">
            <LoadingSpinner size="xl" text={text} />
        </div>
    );
};

export { LoadingSpinner, LoadingOverlay, LoadingPage };
