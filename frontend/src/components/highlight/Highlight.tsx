import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type HighlightColor = 'yellow' | 'green' | 'pink' | 'blue' | 'purple' | 'orange';
type HighlightVariant = 'marker' | 'solid' | 'gradient';
type AnimationType = 'draw' | 'pulse' | 'glow' | 'none';
type Intensity = 'light' | 'medium' | 'strong';

interface HighlightProps {
    children: ReactNode;
    color?: HighlightColor;
    variant?: HighlightVariant;
    animated?: AnimationType;
    intensity?: Intensity;
    className?: string;
}

const colorClasses: Record<HighlightColor, Record<Intensity, string>> = {
    yellow: {
        light: 'bg-yellow-200/30',
        medium: 'bg-yellow-300/50',
        strong: 'bg-yellow-400/70',
    },
    green: {
        light: 'bg-green-200/30',
        medium: 'bg-green-300/50',
        strong: 'bg-green-400/70',
    },
    pink: {
        light: 'bg-pink-200/30',
        medium: 'bg-pink-300/50',
        strong: 'bg-pink-400/70',
    },
    blue: {
        light: 'bg-blue-200/30',
        medium: 'bg-blue-300/50',
        strong: 'bg-blue-400/70',
    },
    purple: {
        light: 'bg-purple-200/30',
        medium: 'bg-purple-300/50',
        strong: 'bg-purple-400/70',
    },
    orange: {
        light: 'bg-orange-200/30',
        medium: 'bg-orange-300/50',
        strong: 'bg-orange-400/70',
    },
};

const gradientClasses: Record<HighlightColor, string> = {
    yellow: 'bg-gradient-to-r from-yellow-200/50 via-yellow-300/60 to-yellow-200/50',
    green: 'bg-gradient-to-r from-green-200/50 via-green-300/60 to-green-200/50',
    pink: 'bg-gradient-to-r from-pink-200/50 via-pink-300/60 to-pink-200/50',
    blue: 'bg-gradient-to-r from-blue-200/50 via-blue-300/60 to-blue-200/50',
    purple: 'bg-gradient-to-r from-purple-200/50 via-purple-300/60 to-purple-200/50',
    orange: 'bg-gradient-to-r from-orange-200/50 via-orange-300/60 to-orange-200/50',
};

export const Highlight = ({
    children,
    color = 'yellow',
    variant = 'marker',
    animated = 'none',
    intensity = 'medium',
    className,
}: HighlightProps) => {
    const baseClasses = 'inline-block px-1 rounded-sm relative';

    const bgClass = variant === 'gradient'
        ? gradientClasses[color]
        : colorClasses[color][intensity];

    const animationClass = {
        draw: 'animate-highlight-draw',
        pulse: 'animate-highlight-pulse',
        glow: 'animate-highlight-glow',
        none: '',
    }[animated];

    const variantClass = {
        marker: 'highlight-marker',
        solid: 'highlight-solid',
        gradient: 'highlight-gradient',
    }[variant];

    return (
        <span className={cn(baseClasses, bgClass, animationClass, variantClass, className)}>
            {children}
        </span>
    );
};
