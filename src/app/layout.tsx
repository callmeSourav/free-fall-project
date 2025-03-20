import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreeFall - Share Your Thoughts Anonymously',
  description: 'A safe space to share your thoughts and feelings anonymously.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
    other: {
      rel: 'mask-icon',
      url: '/favicon.svg',
      color: '#3B82F6'
    }
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
          <Toaster position="top-center" richColors />
        </div>
      </body>
    </html>
  )
} 