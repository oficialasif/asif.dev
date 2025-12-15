'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DynamicThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchAndApplyTheme();
    }, []);

    const fetchAndApplyTheme = async () => {
        try {
            const response = await api.theme.get();
            const theme = response.data.data.theme;
            if (theme) {
                applyTheme(theme);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const applyTheme = (theme: any) => {
        const root = document.documentElement;

        // Apply Colors - Map backend theme colors to all CSS variables
        if (theme.colors) {
            const colors = theme.colors;

            // Primary color
            if (colors.primary) {
                root.style.setProperty('--primary', colors.primary);
                root.style.setProperty('--color-primary', colors.primary);
            }

            // Secondary color
            if (colors.secondary) {
                root.style.setProperty('--secondary', colors.secondary);
                root.style.setProperty('--color-secondary', colors.secondary);
            }

            // Accent color
            if (colors.accent) {
                root.style.setProperty('--accent', colors.accent);
                root.style.setProperty('--color-accent', colors.accent);
            }

            // Background color
            if (colors.background) {
                root.style.setProperty('--background', colors.background);
                root.style.setProperty('--color-background', colors.background);
                document.body.style.background = colors.background;
            }

            // Background secondary
            if (colors.backgroundSecondary) {
                root.style.setProperty('--background-secondary', colors.backgroundSecondary);
                root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
            }

            // Text/Foreground color
            if (colors.text) {
                root.style.setProperty('--foreground', colors.text);
                root.style.setProperty('--color-foreground', colors.text);
                document.body.style.color = colors.text;
            }

            // Text secondary
            if (colors.textSecondary) {
                root.style.setProperty('--text-secondary', colors.textSecondary);
                root.style.setProperty('--color-text-secondary', colors.textSecondary);
                root.style.setProperty('--muted-foreground', colors.textSecondary);
            }

            // Border color
            if (colors.border) {
                root.style.setProperty('--border', colors.border);
                root.style.setProperty('--color-border', colors.border);
            }

            // Card background
            if (colors.cardBackground) {
                root.style.setProperty('--card', colors.cardBackground);
                root.style.setProperty('--color-card', colors.cardBackground);
            }

            // Card hover
            if (colors.cardHover) {
                root.style.setProperty('--card-hover', colors.cardHover);
                root.style.setProperty('--color-card-hover', colors.cardHover);
            }
        }

        // Apply Fonts
        const fonts = theme.fonts || {};
        const headingFont = fonts.heading || "'Inter', sans-serif";
        const bodyFont = fonts.body || "'Inter', sans-serif";
        const codeFont = fonts.code || "'Fira Code', monospace";
        const noticeFont = fonts.notice || "'Inter', sans-serif";

        root.style.setProperty('--font-heading', headingFont);
        root.style.setProperty('--font-body', bodyFont);
        root.style.setProperty('--font-code', codeFont);
        root.style.setProperty('--font-notice', noticeFont);

        // Apply Favicon - Only if explicitly set in theme
        if (theme.faviconUrl && theme.faviconUrl.trim() !== '') {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            // Only update if different to avoid flickering
            if (link.href !== theme.faviconUrl) {
                link.href = theme.faviconUrl;
            }
        }

        // Apply Scroll Animation preference
        if (theme.scrollAnimation) {
            root.style.setProperty('--scroll-behavior', theme.scrollAnimation === 'smooth' ? 'smooth' : 'auto');
            if (theme.scrollAnimation === 'smooth') {
                document.documentElement.style.scrollBehavior = 'smooth';
            } else {
                document.documentElement.style.scrollBehavior = 'auto';
            }
        }

        // Enable/Disable Animations globally
        if (theme.enableAnimations === false) {
            // We can inject a style to disable transitions
            const style = document.createElement('style');
            style.innerHTML = `
            *, *::before, *::after {
                transition-property: none !important;
                transform: none !important;
                animation: none !important;
            }
        `;
            // Only append if strict no-animation is desired. 
            // This might break functional animations (like sliders). 
            // Better to use a class on body and scope CSS.
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    };

    if (!mounted) return <>{children}</>;

    return <>{children}</>;
}
