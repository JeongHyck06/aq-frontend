'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
    onLoad,
    onError,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    return (
        <div
            ref={imgRef}
            className={cn(
                'relative overflow-hidden',
                className
            )}
        >
            {!isLoaded && !hasError && (
                <img
                    src={placeholder}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm"
                />
            )}

            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isLoaded
                            ? 'opacity-100'
                            : 'opacity-0'
                    )}
                />
            )}

            {hasError && (
                <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center">
                    <span className="text-secondary-400 text-sm">
                        이미지를 불러올 수 없습니다
                    </span>
                </div>
            )}
        </div>
    );
};
