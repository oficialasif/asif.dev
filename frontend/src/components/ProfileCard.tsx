'use client';

import { Card } from "./Card";
import { Github, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ProfileCard = () => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a social link
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    router.push('/profile');
  };

  return (
    <div onClick={handleCardClick} className="block h-full cursor-pointer">
      <Card className="bg-[color:var(--color-background)] border-2 border-[color:var(--color-purple-border)] flex flex-col justify-center items-center text-center h-full hover:border-[color:var(--color-purple-border-hover)] transition-all duration-300">
        <div className="relative w-32 h-32 mb-4 mx-auto rounded-full overflow-hidden border-4 border-purple-600/30">
          <Image
            src="/profile.jpg"
            alt="ASIF MAHMUD"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">ASIF MAHMUD</h2>
        <p className="text-sm text-purple-300 mb-6">Full Stack Web Developer</p>
        <div className="flex gap-4 justify-center mx-auto">
          <a href="https://facebook.com/OficialAsif2" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <Facebook size={28} className="text-purple-400 hover:text-purple-300" />
          </a>
          <a href="https://github.com/oficialasif" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <Github size={28} className="text-purple-400 hover:text-purple-300" />
          </a>
          <a href="https://linkedin.com/in/oficialasif" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
            <Linkedin size={28} className="text-purple-400 hover:text-purple-300" />
          </a>
        </div>
      </Card>
    </div>
  );
};

