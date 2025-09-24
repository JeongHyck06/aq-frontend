import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<
    HTMLInputElement,
    InputProps
>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <div className="h-5 w-5 text-secondary-400">
                                {leftIcon}
                            </div>
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            'block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error &&
                                'border-error-300 focus:border-error-500 focus:ring-error-500',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <div className="h-5 w-5 text-secondary-400">
                                {rightIcon}
                            </div>
                        </div>
                    )}
                </div>
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

Input.displayName = 'Input';

export { Input };
