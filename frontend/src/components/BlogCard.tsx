import { Card } from "./Card";
import Link from "next/link";

export const BlogCard = () => {
    return (
        <Link href="/blog" className="block h-full">
            <Card className="bg-[color:var(--color-background)] border-2 border-[color:var(--color-purple-border)] flex items-center justify-center h-full cursor-pointer hover:border-[color:var(--color-purple-border-hover)] transition-all duration-300">
                <h3 className="text-5xl font-bold text-white">Blog</h3>
            </Card>
        </Link>
    );
};
