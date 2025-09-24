'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className,
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const directionVariants = {
        up: { y: 60, opacity: 0 },
        down: { y: -60, opacity: 0 },
        left: { x: 60, opacity: 0 },
        right: { x: -60, opacity: 0 },
    };

    const variants = {
        hidden: directionVariants[direction],
        visible: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};
