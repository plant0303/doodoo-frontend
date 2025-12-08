// mainpage
import HeroSection from "@/components/home/HeroSection";
import Image from "next/image";
import type { Metadata } from 'next'

// metadate 정의하기
export const metadata: Metadata = {
  // Page title (Displayed in the browser tab and search results)
  title: 'Unlimited Free Images - doodoo',

  // Description (Displayed in search results)
  description: 'Unlimited free stock image site. Download high-quality, commercially usable photos for free.',

  icons: {
    // 1. Primary Favicon (Used by most browsers)
    icon: '/logo/favicon-32x32.png',

    // 2. Apple touch icon (for iPhone, iPad, etc.)
    apple: '/apple-icon.png',

    // 3. Optional: Defining various icon sizes
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },

  openGraph: {
    title: 'Unlimited Free Images - doodoo',
    description: 'Discover inspiring free images at doodoo and bring your projects to life!',
    // url: 'https://your-domain.com', // **Remember to uncomment and update this line with your actual domain**
    type: 'website',
  },

  // Twitter Card configuration
  twitter: {
    // card: 'summary_large_image', // Uncomment if you use a large image card
    title: 'Unlimited Free Images - doodoo',
    description: 'Unlimited free stock image site. Download high-quality, commercially usable photos for free.',
  },

  // General meta tags
  keywords: [
    'free images',
    'stock images',
    'commercially usable',
    'copyright free',
    'high quality photos',
    'illustration',
    'vector',
    'design resources',
    'doodoo'
  ],
}

export default function Home() {
  return (
    <>
      <HeroSection />
    </>
  );
}
