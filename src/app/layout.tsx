import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Providers";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
