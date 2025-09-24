'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
    size = 'md',
    color = '#3b82f6',
}) => {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    const containerVariants = {
        start: {
            transition: {
                staggerChildren: 0.2,
            },
        },
        end: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const dotVariants = {
        start: {
            y: '0%',
        },
        end: {
            y: '100%',
        },
    };

    const dotTransition = {
        duration: 0.5,
        yoyo: Infinity,
        ease: 'easeInOut',
    };

    return (
        <motion.div
            className="flex space-x-1"
            variants={containerVariants}
            initial="start"
            animate="end"
        >
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className={`${sizeClasses[size]} rounded-full`}
                    style={{ backgroundColor: color }}
                    variants={dotVariants}
                    transition={dotTransition}
                />
            ))}
        </motion.div>
    );
};
