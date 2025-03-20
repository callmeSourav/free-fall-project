import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Fall - Share Your Thoughts',
  description: 'A platform to share your thoughts and feelings anonymously',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  manifest: '/site.webmanifest',
  themeColor: '#4F46E5',
  viewport: 'width=device-width, initial-scale=1',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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