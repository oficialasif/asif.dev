import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BadgeVariant = 'filled' | 'outlined' | 'subtle';
type BadgeColor = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    color?: BadgeColor;
    size?: BadgeSize;
    className?: string;
}

const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
    primary: {
        filled: 'bg-purple-500 text-white border-purple-500',
        outlined: 'bg-transparent text-purple-400 border-purple-500',
        subtle: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    accent: {
        filled: 'bg-pink-500 text-white border-pink-500',
        outlined: 'bg-transparent text-pink-400 border-pink-500',
        subtle: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    },
    success: {
        filled: 'bg-green-500 text-white border-green-500',
        outlined: 'bg-transparent text-green-400 border-green-500',
        subtle: 'bg-green-500/20 text-green-300 border-green-500/30',
    },
    warning: {
        filled: 'bg-yellow-500 text-black border-yellow-500',
        outlined: 'bg-transparent text-yellow-400 border-yellow-500',
        subtle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    },
    error: {
        filled: 'bg-red-500 text-white border-red-500',
        outlined: 'bg-transparent text-red-400 border-red-500',
        subtle: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    info: {
        filled: 'bg-blue-500 text-white border-blue-500',
        outlined: 'bg-transparent text-blue-400 border-blue-500',
        subtle: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({
    children,
    variant = 'filled',
    color = 'primary',
    size = 'sm',
    className,
}: BadgeProps) => {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-md border transition-all',
                colorStyles[color][variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
};
