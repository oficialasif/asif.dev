import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type UnderlineType = 'straight' | 'wavy' | 'dashed' | 'dotted' | 'gradient' | 'double';
type UnderlineColor = 'primary' | 'accent' | 'success' | 'warning' | 'error';
type AnimationType = 'draw' | 'wave' | 'shimmer' | 'none';
type Thickness = 'thin' | 'medium' | 'thick';

interface UnderlineProps {
    children: ReactNode;
    type?: UnderlineType;
    color?: UnderlineColor;
    animated?: AnimationType;
    thickness?: Thickness;
    className?: string;
}

const colorClasses: Record<UnderlineColor, string> = {
    primary: 'decoration-purple-500',
    accent: 'decoration-pink-500',
    success: 'decoration-green-500',
    warning: 'decoration-yellow-500',
    error: 'decoration-red-500',
};

const thicknessClasses: Record<Thickness, string> = {
    thin: 'decoration-1',
    medium: 'decoration-2',
    thick: 'decoration-4',
};

export const Underline = ({
    children,
    type = 'straight',
    color = 'primary',
    animated = 'none',
    thickness = 'medium',
    className,
}: UnderlineProps) => {
    const baseClasses = 'inline-block relative';

    const typeClass = {
        straight: 'underline',
        wavy: 'underline decoration-wavy',
        dashed: 'underline decoration-dashed',
        dotted: 'underline decoration-dotted',
        gradient: 'underline-gradient',
        double: 'underline decoration-double',
    }[type];

    const animationClass = {
        draw: 'animate-underline-draw',
        wave: 'animate-underline-wave',
        shimmer: 'animate-shimmer',
        none: '',
    }[animated];

    return (
        <span
            className={cn(
                baseClasses,
                typeClass,
                colorClasses[color],
                thicknessClasses[thickness],
                animationClass,
                className
            )}
        >
            {children}
        </span>
    );
};
