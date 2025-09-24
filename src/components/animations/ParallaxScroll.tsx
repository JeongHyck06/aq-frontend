'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';

interface ParallaxScrollProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}

export const ParallaxScroll: React.FC<
    ParallaxScrollProps
> = ({ children, speed = 0.5, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        ['0%', `${speed * 100}%`]
    );

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </div>
    );
};
