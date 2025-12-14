import { Card } from "./Card";
import Link from "next/link";

export const GalleryCard = () => {
    return (
        <Link href="/gallery" className="block h-full">
            <Card className="bg-[#0a0514] border-2 border-purple-600/50 flex items-center justify-center h-full cursor-pointer hover:border-purple-500/70 transition-all duration-300">
                <h3 className="text-5xl font-bold text-white">Gallery</h3>
            </Card>
        </Link>
    );
};
