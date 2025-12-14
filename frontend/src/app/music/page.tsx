'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentArea } from '@/components/ContentArea';
import { SpotifyCard } from '@/components/SpotifyCard';

export default function MusicPage() {
    return (
        <DashboardLayout>
            <ContentArea
                title="Music Player"
                description="Enjoy my curated playlist while browsing"
                enableMagnetism={false}
            >
                <SpotifyCard />
            </ContentArea>
        </DashboardLayout>
    );
}
