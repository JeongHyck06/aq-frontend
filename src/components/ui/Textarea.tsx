import React from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    TextareaProps
>(
    (
        {
            className,
            label,
            error,
            helperText,
            resize = 'vertical',
            ...props
        },
        ref
    ) => {
        const resizeClasses = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize',
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    className={cn(
                        'block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500',
                        resizeClasses[resize],
                        error &&
                            'border-error-300 focus:border-error-500 focus:ring-error-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error-600">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-secondary-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
