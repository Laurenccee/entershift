import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
});

export const metadata: Metadata = {
  title: 'EnterShift',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${karla.variable}`}>
      <body className={` antialiased`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
