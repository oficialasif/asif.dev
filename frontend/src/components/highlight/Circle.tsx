import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type CircleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
type CircleStyle = 'rough' | 'smooth' | 'dashed';
type AnimationType = 'draw' | 'pulse' | 'bounce' | 'none';

interface CircleProps {
    children: ReactNode;
    color?: CircleColor;
    style?: CircleStyle;
    animated?: AnimationType;
    thickness?: number;
    padding?: number;
    className?: string;
}

const colorClasses: Record<CircleColor, string> = {
    red: 'stroke-red-500',
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500',
    orange: 'stroke-orange-500',
};

export const Circle = ({
    children,
    color = 'red',
    style: circleStyle = 'rough',
    animated = 'draw',
    thickness = 3,
    padding = 8,
    className,
}: CircleProps) => {
    const pathRef = useRef<SVGPathElement>(null);

    const animationClass = {
        draw: '', // We'll handle with GSAP
        pulse: 'animate-circle-pulse',
        bounce: 'animate-circle-bounce',
        none: '',
    }[animated];

    // SVG path for rough hand-drawn circle (OPEN - not connected)
    const roughCirclePath = `
    M 10,50 
    Q 8,28 18,15 
    Q 32,6 50,7 
    Q 68,8 82,18 
    Q 92,32 90,50 
    Q 88,68 78,82 
    Q 64,92 50,90 
    Q 32,88 18,78 
    Q 10,68 12,52
  `;

    // SVG path for smooth circle (OPEN - not connected)
    const smoothCirclePath = `
    M 10,50 
    A 40,40 0 1,1 90,52
  `;

    const strokeDasharray = circleStyle === 'dashed' ? '5,5' : undefined;
    const path = circleStyle === 'rough' ? roughCirclePath : smoothCirclePath;

    // GSAP looping animation
    useEffect(() => {
        if (animated === 'draw' && pathRef.current) {
            const pathLength = pathRef.current.getTotalLength();

            // Set initial state
            gsap.set(pathRef.current, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });

            // Create infinite loop timeline
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

            tl.to(pathRef.current, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: 'power2.inOut',
            }).to(pathRef.current, {
                strokeDashoffset: -pathLength,
                duration: 1.5,
                ease: 'power2.inOut',
                delay: 0.3,
            });

            return () => {
                tl.kill();
            };
        }
    }, [animated]);

    return (
        <span
            className={cn('inline-block relative', className)}
            style={{ padding: `${padding}px` }}
        >
            {/* Content - Lower z-index so circle appears on top */}
            <span className="relative z-0">
                {children}
            </span>

            {/* SVG Circle Overlay - Higher z-index to appear on top */}
            <svg
                className={cn(
                    'absolute inset-0 w-full h-full pointer-events-none z-10',
                    colorClasses[color],
                    animationClass
                )}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                    overflow: 'visible',
                }}
            >
                <path
                    ref={pathRef}
                    d={path}
                    fill="none"
                    strokeWidth={thickness}
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{
                        filter: circleStyle === 'rough' ? 'url(#roughen)' : undefined,
                    }}
                />

                {/* SVG Filter for roughness */}
                {circleStyle === 'rough' && (
                    <defs>
                        <filter id="roughen">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.05"
                                numOctaves="2"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="2"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    </defs>
                )}
            </svg>
        </span>
    );
};
