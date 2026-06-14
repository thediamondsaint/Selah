'use client'
import Link from 'next/link'

const FEATURES = [
  {
    href: '/tutor',
    accent: '#818cf8',
    gradientFrom: 'rgba(30,27,75,0.9)',
    border: '#312e81',
    icon: '📖',
    label: 'STUDY',
    title: 'Bible Tutor',
    description: 'Ask anything about scripture — history, meaning, theology, or how it applies to your life today.',
    cta: 'Start studying',
  },
  {
    href: '/plain',
    accent: '#4ade80',
    gradientFrom: 'rgba(5,46,22,0.9)',
    border: '#14532d',
    icon: '✦',
    label: 'TRANSLATE',
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
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{
          display: 'inline-block',
          fontSize: '10px',
          letterSpacing: '0.22em',
          color: '#444',
          marginBottom: '2rem',
          padding: '4px 14px',
          border: '1px solid #1e1e1e',
          borderRadius: '999px',
        }}>
          SELAH
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: '600',
          lineHeight: '1.15',
          marginBottom: '1.25rem',
          color: '#f0f0f0',
          letterSpacing: '-0.025em',
        }}>
          Understand the Bible<br />like never before
        </h1>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: '400px', margin: '0 auto', lineHeight: '1.75' }}>
          AI-powered tools for deeper scripture study — plain language, guided learning, and daily devotion.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid-2" style={{ gap: '16px', marginBottom: '3.5rem' }}>
        {FEATURES.map(f => (
          <Link key={f.href} href={f.href} style={{ display: 'block' }}>
            <div
              style={{
                background: `radial-gradient(ellipse at top left, ${f.gradientFrom} 0%, #0c0c0c 65%)`,
                border: '1px solid #1e1e1e',
                borderRadius: '20px',
                padding: '2rem 1.75rem',
                height: '100%',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.border
                e.currentTarget.style.boxShadow = `0 0 0 1px ${f.border}55, 0 12px 40px ${f.accent}12`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e1e'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: f.accent,
                marginBottom: '1.25rem',
                opacity: 0.65,
              }}>
                {f.label}
              </div>
              <div style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.6rem', color: '#ebebeb' }}>
                {f.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {f.description}
              </p>
              <span style={{ fontSize: '13px', color: f.accent }}>
                {f.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Coming soon */}
      <div style={{ marginBottom: '5rem' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.18em', color: '#3a3a3a', marginBottom: '1rem' }}>
          COMING SOON
        </p>
        <div className="grid-2" style={{ gap: '8px' }}>
          {COMING_SOON.map(f => (
            <div
              key={f.title}
              style={{
                background: '#0c0c0c',
                border: '1px solid #161616',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                opacity: 0.5,
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#bbb', marginBottom: '3px' }}>
                {f.icon} {f.title}
              </p>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #141414' }}>
        <p style={{ fontSize: '12px', color: '#3a3a3a' }}>
          Built with care ·{' '}
          <a href="mailto:hello@selah.ai" style={{ color: '#484848' }}>Contact</a>
        </p>
      </div>

    </div>
  )
}
