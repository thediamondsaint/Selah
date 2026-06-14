'use client'
import Link from 'next/link'

const FEATURES = [
  {
    href: '/tutor',
    color: '#818cf8',
    bg: '#1e1b4b',
    border: '#312e81',
    icon: '📖',
    title: 'Bible Tutor',
    description: 'Ask anything about scripture — history, meaning, theology, or how it applies to your life today.',
    cta: 'Start studying',
  },
  {
    href: '/plain',
    color: '#4ade80',
    bg: '#052e16',
    border: '#14532d',
    icon: '✦',
    title: 'Plain Language',
    description: 'Any verse rewritten in clear modern English — for any reading level, from age 8 to adult.',
    cta: 'Try it',
  },
]

const COMING_SOON = [
  { icon: '🗓', title: 'Reading Plans', description: 'Personalized plans built around your goals and schedule.' },
  { icon: '✉', title: 'Daily Devotional', description: 'A fresh AI-written devotional in your inbox every morning.' },
  { icon: '🔍', title: 'Semantic Search', description: 'Find verses by feeling or theme, not just keywords.' },
  { icon: '🙏', title: 'Prayer Generator', description: 'Turn any passage into a personal prayer.' },
]

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ fontSize: '13px', letterSpacing: '0.15em', color: '#666', marginBottom: '1rem' }}>SELAH</p>
        <h1 style={{ fontSize: '3rem', fontWeight: '600', lineHeight: '1.2', marginBottom: '1rem' }}>
          Understand the Bible<br />like never before
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto' }}>
          AI-powered tools for deeper scripture study — plain language, guided learning, and daily devotion.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '3rem' }}>
        {FEATURES.map(f => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#111',
              border: `1px solid #222`,
              borderRadius: '16px',
              padding: '1.5rem',
              height: '100%',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = f.border)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: f.bg, border: `1px solid ${f.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', marginBottom: '1rem'
              }}>
                {f.icon}
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem', color: '#f0f0f0' }}>{f.title}</h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.6', marginBottom: '1.25rem' }}>{f.description}</p>
              <span style={{ fontSize: '13px', color: f.color }}>{f.cta} →</span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#555', marginBottom: '1rem' }}>COMING SOON</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {COMING_SOON.map(f => (
            <div key={f.title} style={{
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              opacity: 0.6,
            }}>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#ccc', marginBottom: '4px' }}>{f.icon} {f.title}</p>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a1a1a' }}>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Built with care · <a href="mailto:hello@selah.ai" style={{ color: '#666' }}>Contact</a>
        </p>
      </div>

    </main>
  )
}