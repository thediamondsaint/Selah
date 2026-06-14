import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './components/Header'
import { ProfileProvider } from './profile/ProfileContext'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Selah — Bible Study, Reimagined',
  description: 'AI-powered tools for deeper scripture study — plain language, guided learning, and daily devotion.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ProfileProvider>
          <Header />
          {children}
        </ProfileProvider>
      </body>
    </html>
  )
}
