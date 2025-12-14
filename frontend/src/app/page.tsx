import { BentoGrid } from "@/components/BentoGrid";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-8" suppressHydrationWarning>
      <div className="w-full max-w-7xl" suppressHydrationWarning>
        <BentoGrid />
      </div>
    </main>
  );
}
