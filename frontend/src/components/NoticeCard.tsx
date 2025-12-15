'use client';

import { Card } from "./Card";
import { Bell } from "lucide-react";
import ContentRenderer from './ContentRenderer';

import { api } from "@/lib/api";
import { useState, useEffect } from "react";

export const NoticeCard = () => {
    const [notices, setNotices] = useState<string[]>([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.notices.getAll();
                const fetchedNotices = response.data.data.map((n: any) => n.text);
                setNotices(fetchedNotices);
            } catch (error) {
                console.error("Failed to fetch notices:", error);
            }
        };

        fetchNotices();
    }, []);

    // Join all notices with separator
    const noticeText = notices.length > 0
        ? notices.join("  •  ")
        : "Welcome to my portfolio! Check back soon for updates.  •  Contact me for collaborations.";


    return (
        <Card
            className="border-2 h-full w-full p-6 overflow-hidden relative"
            style={{
                background: 'var(--color-background)',
                borderColor: 'var(--color-purple-border)'
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="text-lg font-bold text-purple-400">Announcements</h3>
            </div>

            {/* Scrolling Ticker Container */}
            <div className="relative overflow-hidden bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                {/* Gradient overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-purple-900/40 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-900/40 to-transparent z-10 pointer-events-none"></div>

                {/* Scrolling text */}
                <div className="flex whitespace-nowrap animate-scroll-horizontal">
                    {/* First copy */}
                    <span className="text-purple-100/90 text-lg font-notice px-4 inline-flex items-center">
                        <ContentRenderer html={noticeText} />
                    </span>
                    {/* Second copy for seamless loop */}
                    <span className="text-purple-100/90 text-lg font-notice px-4 inline-flex items-center">
                        <ContentRenderer html={noticeText} />
                    </span>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes scroll-horizontal {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll-horizontal {
                    animation: scroll-horizontal 30s linear infinite;
                }
                
                .animate-scroll-horizontal:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </Card>
    );
};
