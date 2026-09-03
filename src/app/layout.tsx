import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/store/Providers";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import { Analytics } from '@vercel/analytics/next';
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: [
      { url: '/shopnercoat-icon.png', sizes: 'any' },
    ],
    shortcut: '/shopnercoat-icon.png',
    apple: '/shopnercoat-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased font-sans">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
