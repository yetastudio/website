
//! Next Core
import type { Metadata } from 'next';

//! Metadata
export const metadata: Metadata = {
  title: 'Yeta Studio',
  description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
  // metadataBase: new URL('https://'),
  // verification: {
  //   google: '',
  // },
  openGraph: {
    title: 'Yeta Studio',
    description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
    // url: 'https://',
    siteName: 'Yeta Studio',
    images: [
      {
        url: new URL(
          'https://res.cloudinary.com/doowhwdzj/image/upload/v1745552324/thumbnail_fbehu9.png'
        ),
      },
    ],
  },
  twitter: {
    title: 'Yeta Studio',
    description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
    images: [
      new URL(
        'https://res.cloudinary.com/doowhwdzj/image/upload/v1745552324/thumbnail_fbehu9.png'
      ),
    ],
  },
};

//! Fonts
import { Funnel_Display } from "next/font/google";

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
});

//! Styles
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}
