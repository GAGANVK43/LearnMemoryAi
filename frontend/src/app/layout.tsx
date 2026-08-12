import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LearnMemory AI — Your AI That Remembers What You Learn',
  description: 'LearnMemory AI turns your study sessions into a personal learning memory and uses that memory to teach you exactly what you need.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
