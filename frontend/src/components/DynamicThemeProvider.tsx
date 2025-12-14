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

        // Apply Colors
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                const colorValue = value as string;

                // Map generic keys to specific CSS variables used in globals.css
                // We set both the standard generic var and the specific --color-* var

                if (key === 'primary') {
                    root.style.setProperty('--primary', colorValue);
                    root.style.setProperty('--color-primary', colorValue);
                    // Also enable these to be used with opacity if possible, but for now simple hex
                }
                else if (key === 'secondary') {
                    root.style.setProperty('--secondary', colorValue);
                    root.style.setProperty('--color-secondary', colorValue);
                }
                else if (key === 'accent') {
                    root.style.setProperty('--accent', colorValue);
                    root.style.setProperty('--color-accent', colorValue);
                }
                else if (key === 'background') {
                    root.style.setProperty('--background', colorValue);
                    root.style.setProperty('--color-background', colorValue);
                    // Update body background directly just in case
                    document.body.style.background = colorValue;
                }
                else if (key === 'text') {
                    root.style.setProperty('--foreground', colorValue);
                    root.style.setProperty('--color-foreground', colorValue);
                    document.body.style.color = colorValue;
                }
                else if (key === 'cardBackground') {
                    root.style.setProperty('--color-card', colorValue);
                    root.style.setProperty('--card', colorValue);
                }
                else {
                    // Fallback for other keys
                    root.style.setProperty(`--${key}`, colorValue);
                    root.style.setProperty(`--color-${key}`, colorValue);
                }
            });
        }

        // Apply Fonts
        if (theme.fonts) {
            Object.entries(theme.fonts).forEach(([key, value]) => {
                const fontValue = value as string;
                if (!fontValue) return;

                const fontName = fontValue.split(',')[0].replace(/['"]/g, '').trim();
                const link = document.createElement('link');
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);

                // Set variable
                if (key === 'body') {
                    root.style.setProperty('--font-sans', fontValue);
                    document.body.style.fontFamily = fontValue;
                } else if (key === 'heading') {
                    root.style.setProperty('--font-heading', fontValue);
                } else if (key === 'code') {
                    root.style.setProperty('--font-mono', fontValue);
                }
            });
        }

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
