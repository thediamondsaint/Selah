import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

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
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          borderBottom: '1px solid #161616',
          background: 'rgba(8,8,8,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.14em',
              color: '#e0e0e0',
            }}>SELAH</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[
              { href: '/interlinear', label: 'Interlinear' },
              { href: '/tutor', label: 'Tutor' },
              { href: '/plain', label: 'Plain' },
              { href: '/plans', label: 'Plans' },
              { href: '/devotional', label: 'Devotional' },
              { href: '/search', label: 'Search' },
              { href: '/prayer', label: 'Prayer' },
              { href: '/compare', label: 'Compare' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: '12px',
                  color: '#555',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  transition: 'color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
