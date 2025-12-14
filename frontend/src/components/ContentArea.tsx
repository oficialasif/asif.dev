'use client';

import { Card } from './Card';
import { cn } from '@/lib/utils';

interface ContentAreaProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    enableMagnetism?: boolean;
}

export const ContentArea = ({
    children,
    className,
    title,
    description,
    enableMagnetism = true
}: ContentAreaProps) => {
    return (
        <main className="flex-1 bg-[#0D081A] p-6 h-screen flex flex-col">
            <div className="max-w-6xl mx-auto flex flex-col h-full w-full">
                {/* Page Header - Fixed */}
                {(title || description) && (
                    <div className="mb-6 flex-shrink-0">
                        {title && (
                            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-purple-200/70 text-lg">{description}</p>
                        )}
                    </div>
                )}

                {/* Main Content Card - Fixed with scrollable content inside */}
                <div className="flex-1 min-h-0">
                    <Card
                        className={cn(
                            "bg-[#0a0514] border-2 border-purple-600/50 h-full flex flex-col",
                            className
                        )}
                        enableMagnetism={enableMagnetism}
                    >
                        <div className="overflow-y-auto dashboard-scroll h-full p-6">
                            {children}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
};
