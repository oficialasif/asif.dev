import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type LineColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
type AnimationType = 'draw' | 'pulse' | 'none';

interface MarkerLineProps {
    children: ReactNode;
    color?: LineColor;
    animated?: AnimationType;
    thickness?: number;
    offset?: number; // Distance below text
    className?: string;
}

const colorClasses: Record<LineColor, string> = {
    red: 'stroke-red-500',
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500',
    orange: 'stroke-orange-500',
};

export const MarkerLine = ({
    children,
    color = 'red',
    animated = 'draw',
    thickness = 4,
    offset = 2,
    className,
}: MarkerLineProps) => {
    const animationClass = {
        draw: 'animate-marker-draw',
        pulse: 'animate-marker-pulse',
        none: '',
    }[animated];

    // Hand-drawn wavy line path for realistic marker effect
    const wavyLinePath = `
    M 2,15 
    Q 10,12 20,14 
    Q 30,16 40,13 
    Q 50,11 60,14 
    Q 70,17 80,14 
    Q 90,12 98,15
  `;

    return (
        <span className={cn('inline-block relative', className)}>
            {/* Content */}
            <span className="relative z-10">
                {children}
            </span>

            {/* SVG Marker Line Below */}
            <svg
                className={cn(
                    'absolute left-0 w-full pointer-events-none',
                    colorClasses[color],
                    animationClass
                )}
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
                style={{
                    top: `calc(100% - ${offset}px)`,
                    height: '20px',
                }}
            >
                <path
                    d={wavyLinePath}
                    fill="none"
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
};
