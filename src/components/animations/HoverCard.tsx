'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface HoverCardProps {
    children: React.ReactNode;
    className?: string;
    hoverScale?: number;
    hoverRotate?: number;
    hoverShadow?: boolean;
}

export const HoverCard: React.FC<HoverCardProps> = ({
    children,
    className,
    hoverScale = 1.02,
    hoverRotate = 0,
    hoverShadow = true,
}) => {
    return (
        <motion.div
            className={cn(
                'transition-all duration-300',
                className
            )}
            whileHover={{
                scale: hoverScale,
                rotate: hoverRotate,
                transition: {
                    duration: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                },
            }}
            whileTap={{
                scale: 0.98,
                transition: {
                    duration: 0.1,
                },
            }}
            style={{
                boxShadow: hoverShadow
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    : 'none',
            }}
        >
            {children}
        </motion.div>
    );
};
