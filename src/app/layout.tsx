//! Next Core
import localFont from 'next/font/local';
import type { Metadata } from 'next';

//! Context
import { ThemeProvider } from '@/context/ThemeContext';

//! Metadata
export const metadata: Metadata = {
  title: '✹ Yeta Studio™',
  description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
  // metadataBase: new URL('https://'),
  // verification: {
  //   google: '',
  // },
  openGraph: {
    title: '✹ Yeta Studio™',
    description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
    // url: 'https://',
    siteName: '✹ Yeta Studio™',
    images: [
      {
        url: new URL(
          'https://res.cloudinary.com/doowhwdzj/image/upload/v1745707410/thumbnail_v5s8lz.png'
        ),
      },
    ],
  },
  twitter: {
    title: '✹ Yeta Studio™',
    description: "'Cause 𝗴͟𝗿͟𝗲͟𝗮͟𝘁 brands aren't built on 𝗹𝘂̶𝗰̶𝗸̶.",
    images: [
      new URL(
        'https://res.cloudinary.com/doowhwdzj/image/upload/v1745707410/thumbnail_v5s8lz.png'
      ),
    ],
  },
};

//! Fonts
const editorialNewLight = localFont({
  src: '../../public/fonts/PPEditorialNew-Ultralight.otf',
  variable: '--font-editorial-new-light',
  weight: '400',
});

const editorialNewRegular = localFont({
  src: '../../public/fonts/PPEditorialNew-Regular.otf',
  variable: '--font-editorial-new',
  weight: '400',
});

const editorialNewItalic = localFont({
  src: '../../public/fonts/PPEditorialNew-Italic.otf',
  variable: '--font-editorial-new-italic',
  weight: '400',
});

const funnelDisplayLight = localFont({
  src: '../../public/fonts/FunnelDisplay-Light.woff2',
  variable: "--font-funnel-display-light",
  weight: "300",
});
const funnelDisplayRegular = localFont({
  src: '../../public/fonts/FunnelDisplay-Regular.woff2',
  variable: "--font-funnel-display-regular",
  weight: "400",
});
const funnelDisplayMedium = localFont({
  src: '../../public/fonts/FunnelDisplay-Medium.woff2',
  variable: "--font-funnel-display-medium",
  weight: "500",
});
const funnelDisplayBold = localFont({
  src: '../../public/fonts/FunnelDisplay-Bold.woff2',
  variable: "--font-funnel-display-bold",
  weight: "700",
});

//! UI Core
import Cursor from '@/components/ui/cursor';

//! Styles
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${funnelDisplayLight.variable} ${funnelDisplayRegular.variable} 
      ${funnelDisplayMedium.variable} ${funnelDisplayBold.variable}
      ${editorialNewLight.variable} ${editorialNewRegular.variable} ${editorialNewItalic.variable}
      `}>
        <ThemeProvider>
          <Cursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
