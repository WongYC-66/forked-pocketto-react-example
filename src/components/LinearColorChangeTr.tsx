import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const LinearColorChangeTr = ({
    start,
    transitionColor = '#00ff00',
    children,
    className,
    onClick,
}: {
    start: boolean;
    transitionColor?: string;
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => {
    const [initialColor, setInitialColor] = useState('#ffffff');

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setInitialColor(prefersDarkMode ? '#000000' : '#ffffff');
    }, []);

    return (
        <motion.tr
            style={{
                backgroundColor: initialColor,
            }}
            className={cn(
                'h-full w-full',
                className,
            )}
            animate={
                start
                    ? {
                        backgroundColor: [
                            initialColor,
                            transitionColor,
                            transitionColor,
                            initialColor
                        ],
                    }
                    : {}
            }
            onClick={onClick}
            transition={
                start
                    ? {
                        times: [0, 0, 0.1, 0.5],
                        duration: 2.1,
                        ease: 'linear',
                    }
                    : {}
            }
        >
            {children}
        </motion.tr>
    );
};
