import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

type NoticeType = 'info' | 'warning' | 'error' | 'success' | 'custom';

interface NoticeProps {
    children: ReactNode;
    type?: NoticeType;
    icon?: boolean;
    animated?: boolean;
    title?: string;
    className?: string;
}

const noticeStyles: Record<NoticeType, { bg: string; border: string; text: string; icon: typeof Info }> = {
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        icon: Info,
    },
    warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        icon: AlertTriangle,
    },
    error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/50',
        text: 'text-red-400',
        icon: AlertCircle,
    },
    success: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/50',
        text: 'text-green-400',
        icon: CheckCircle,
    },
    custom: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        icon: Sparkles,
    },
};

export const Notice = ({
    children,
    type = 'info',
    icon = true,
    animated = true,
    title,
    className,
}: NoticeProps) => {
    const style = noticeStyles[type];
    const Icon = style.icon;

    return (
        <div
            className={cn(
                'p-4 rounded-lg border-l-4 my-4',
                style.bg,
                style.border,
                animated && 'animate-notice-entrance',
                className
            )}
        >
            <div className="flex items-start gap-3">
                {icon && (
                    <div className={cn('flex-shrink-0 mt-0.5', style.text)}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div className="flex-1">
                    {title && (
                        <h4 className={cn('font-semibold mb-1', style.text)}>
                            {title}
                        </h4>
                    )}
                    <div className="text-gray-300 text-sm leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
