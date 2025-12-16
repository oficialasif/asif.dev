'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MobileNavProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const MobileNav = ({ isOpen, onToggle }: MobileNavProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show when scrolling up, hide when scrolling down
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <motion.button
            onClick={onToggle}
            initial={{ opacity: 1, y: 0 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : -20
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-4 right-4 z-[60] lg:hidden w-12 h-12 bg-[color:var(--color-background)] border-2 border-[color:var(--color-purple-border)] rounded-xl flex items-center justify-center hover:border-[color:var(--color-purple-border-hover)] transition-all duration-300 hover:shadow-[0_0_15px_var(--color-glow)]"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                    className="block w-6 h-0.5 bg-purple-400 rounded-full"
                    animate={{
                        rotate: isOpen ? 45 : 0,
                        y: isOpen ? 8 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
                <motion.span
                    className="block w-6 h-0.5 bg-purple-400 rounded-full my-1.5"
                    animate={{
                        opacity: isOpen ? 0 : 1,
                        x: isOpen ? -20 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
                <motion.span
                    className="block w-6 h-0.5 bg-purple-400 rounded-full"
                    animate={{
                        rotate: isOpen ? -45 : 0,
                        y: isOpen ? -8 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
            </div>
        </motion.button>
    );
};
