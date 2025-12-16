'use client';

import { ProfileCard } from "./ProfileCard";
import { ProjectCard } from "./ProjectCard";
import { BlogCard } from "./BlogCard";
import { GalleryCard } from "./GalleryCard";
import { ContactCard } from "./ContactCard";
import { SpotifyCard } from "./SpotifyCard";
import { NoticeCard } from "./NoticeCard";
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '167, 139, 250'; // Purple color

const calculateSpotlightValues = (radius: number) => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (
    card: HTMLElement,
    mouseX: number,
    mouseY: number,
    glow: number
) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glow.toString());
};

export const BentoGrid = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        // Create global spotlight
        const spotlight = document.createElement('div');
        spotlight.className = 'global-spotlight';
        spotlight.style.cssText = `
            position: fixed;
            width: 800px;
            height: 800px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle,
                rgba(${DEFAULT_GLOW_COLOR}, 0.15) 0%,
                rgba(${DEFAULT_GLOW_COLOR}, 0.08) 15%,
                rgba(${DEFAULT_GLOW_COLOR}, 0.04) 25%,
                rgba(${DEFAULT_GLOW_COLOR}, 0.02) 40%,
                rgba(${DEFAULT_GLOW_COLOR}, 0.01) 65%,
                transparent 70%
            );
            z-index: 200;
            opacity: 0;
            transform: translate(-50%, -50%);
            mix-blend-mode: screen;
        `;
        document.body.appendChild(spotlight);
        spotlightRef.current = spotlight;

        const handleMouseMove = (e: MouseEvent) => {
            if (!spotlightRef.current || !gridRef.current) return;

            const rect = gridRef.current.getBoundingClientRect();
            const mouseInside =
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;

            const cards = gridRef.current.querySelectorAll('.card-with-glow');

            if (!mouseInside) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                cards.forEach(card => {
                    (card as HTMLElement).style.setProperty('--glow-intensity', '0');
                });
                return;
            }

            const { proximity, fadeDistance } = calculateSpotlightValues(DEFAULT_SPOTLIGHT_RADIUS);
            let minDistance = Infinity;

            cards.forEach(card => {
                const cardElement = card as HTMLElement;
                const cardRect = cardElement.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;
                const distance =
                    Math.hypot(e.clientX - centerX, e.clientY - centerY) -
                    Math.max(cardRect.width, cardRect.height) / 2;
                const effectiveDistance = Math.max(0, distance);

                minDistance = Math.min(minDistance, effectiveDistance);

                let glowIntensity = 0;
                if (effectiveDistance <= proximity) {
                    glowIntensity = 1;
                } else if (effectiveDistance <= fadeDistance) {
                    glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
                }

                updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity);
            });

            gsap.to(spotlightRef.current, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });

            const targetOpacity =
                minDistance <= proximity
                    ? 0.8
                    : minDistance <= fadeDistance
                        ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
                        : 0;

            gsap.to(spotlightRef.current, {
                opacity: targetOpacity,
                duration: targetOpacity > 0 ? 0.2 : 0.5,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gridRef.current?.querySelectorAll('.card-with-glow').forEach(card => {
                (card as HTMLElement).style.setProperty('--glow-intensity', '0');
            });
            if (spotlightRef.current) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
        };
    }, []);

    return (
        <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto p-2 sm:p-4 bento-section"
            suppressHydrationWarning
        >
            {/* Profile Card - Smaller, spans 2 rows */}
            <div className="md:row-span-2" suppressHydrationWarning>
                <ProfileCard />
            </div>

            {/* Projects Card */}
            <ProjectCard />

            {/* Blog Card */}
            <BlogCard />

            {/* Gallery Card */}
            <GalleryCard />

            {/* Contact Card */}
            <ContactCard />

            {/* Spotify Card */}
            <SpotifyCard />

            {/* Notice Card - Spans 2 columns */}
            <div className="md:col-span-2" suppressHydrationWarning>
                <NoticeCard />
            </div>
        </div>
    );
};
