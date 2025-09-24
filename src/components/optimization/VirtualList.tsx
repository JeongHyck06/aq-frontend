'use client';

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import { cn } from '@/utils/cn';

interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    overscan?: number;
}

export function VirtualList<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className,
    overscan = 5,
}: VirtualListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const visibleRange = useMemo(() => {
        const startIndex = Math.max(
            0,
            Math.floor(scrollTop / itemHeight) - overscan
        );
        const endIndex = Math.min(
            items.length - 1,
            Math.ceil(
                (scrollTop + containerHeight) / itemHeight
            ) + overscan
        );
        return { startIndex, endIndex };
    }, [
        scrollTop,
        itemHeight,
        containerHeight,
        items.length,
        overscan,
    ]);

    const visibleItems = useMemo(() => {
        const result = [];
        for (
            let i = visibleRange.startIndex;
            i <= visibleRange.endIndex;
            i++
        ) {
            result.push({
                index: i,
                item: items[i],
                top: i * itemHeight,
            });
        }
        return result;
    }, [visibleRange, items, itemHeight]);

    const totalHeight = items.length * itemHeight;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setScrollTop(container.scrollTop);
        };

        container.addEventListener('scroll', handleScroll);
        return () =>
            container.removeEventListener(
                'scroll',
                handleScroll
            );
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn('overflow-auto', className)}
            style={{ height: containerHeight }}
        >
            <div
                style={{
                    height: totalHeight,
                    position: 'relative',
                }}
            >
                {visibleItems.map(
                    ({ index, item, top }) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                top,
                                left: 0,
                                right: 0,
                                height: itemHeight,
                            }}
                        >
                            {renderItem(item, index)}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
