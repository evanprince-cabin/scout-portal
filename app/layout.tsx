import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Cabin Scout Portal',
  description: 'Referral partner portal for Cabin scouts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${GeistSans.variable} ${inter.variable} font-geist bg-cabin-linen text-cabin-charcoal antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
