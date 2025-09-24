import React from 'react';
import { cn } from '@/utils/cn';
import { User } from 'lucide-react';

interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fallback?: string;
    children?: React.ReactNode;
}

const Avatar = React.forwardRef<
    HTMLDivElement,
    AvatarProps
>(
    (
        {
            className,
            src,
            alt,
            size = 'md',
            fallback,
            children,
            ...props
        },
        ref
    ) => {
        const sizeClasses = {
            sm: 'h-8 w-8 text-xs',
            md: 'h-10 w-10 text-sm',
            lg: 'h-12 w-12 text-base',
            xl: 'h-16 w-16 text-lg',
        };

        const getInitials = (name: string) => {
            return name
                .split(' ')
                .map((word) => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-full bg-secondary-100',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="aspect-square h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary-200 text-secondary-600">
                        {children ||
                            (fallback ? (
                                <span className="font-medium">
                                    {getInitials(fallback)}
                                </span>
                            ) : (
                                <User className="h-1/2 w-1/2" />
                            ))}
                    </div>
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export { Avatar };
