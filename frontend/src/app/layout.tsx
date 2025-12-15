import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Dev Asif',
  description: 'Modern Portfolio of ASIF MAHMUD - Full-Stack Developer & Designer',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
