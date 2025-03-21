import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Fall - Share Your Thoughts',
  description: 'A platform to share your thoughts and feelings anonymously',
  metadataBase: new URL('http://localhost:3001'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
    other: {
      rel: 'mask-icon',
      url: '/favicon.svg',
      color: '#4F46E5'
    }
  },
  manifest: '/site.webmanifest',
  robots: 'index, follow',
  openGraph: {
    title: 'Free Fall - Share Your Thoughts',
    description: 'A platform to share your thoughts and feelings anonymously',
    type: 'website',
    locale: 'en_US',
    siteName: 'Free Fall',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fall - Share Your Thoughts',
    description: 'A platform to share your thoughts and feelings anonymously',
  }
}

export const viewport: Viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/favicon.svg" color="#4F46E5" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </div>
      </body>
    </html>
  )
} 