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
  {
    href: '/plans',
    accent: '#f59e0b',
    gradientFrom: 'rgba(28,18,0,0.9)',
    border: '#78350f',
    icon: '🗓',
    label: 'PLAN',
    title: 'Reading Plans',
    description: 'Personalized reading plans built around your goals, schedule, and pace.',
    cta: 'Build a plan',
  },
  {
    href: '/devotional',
    accent: '#fb7185',
    gradientFrom: 'rgba(26,0,16,0.9)',
    border: '#9f1239',
    icon: '✉',
    label: 'REFLECT',
    title: 'Daily Devotional',
    description: 'A fresh AI-written devotional — passage, reflection, and closing prayer.',
    cta: "Read today's",
  },
  {
    href: '/search',
    accent: '#22d3ee',
    gradientFrom: 'rgba(0,28,32,0.9)',
    border: '#164e63',
    icon: '🔍',
    label: 'DISCOVER',
    title: 'Semantic Search',
    description: 'Find verses by feeling or theme — not just keywords. Describe what you need.',
    cta: 'Start searching',
  },
  {
    href: '/prayer',
    accent: '#c084fc',
    gradientFrom: 'rgba(19,0,32,0.9)',
    border: '#6b21a8',
    icon: '🙏',
    label: 'PRAY',
    title: 'Prayer Generator',
    description: 'Turn any passage or situation into a sincere, personal prayer.',
    cta: 'Write a prayer',
  },
  {
    href: '/compare',
    accent: '#38bdf8',
    gradientFrom: 'rgba(0,24,38,0.9)',
    border: '#075985',
    icon: '⇄',
    label: 'COMPARE',
    title: 'Verse Comparison',
    description: 'See any verse across 9 major translations — KJV, ESV, NIV, NLT, MSG, and more.',
    cta: 'Compare translations',
  },
]

function FeatureCard({ f }: { f: typeof FEATURES[number] }) {
  return (
    <Link href={f.href} style={{ display: 'block' }}>
      <div
        style={{
          background: `radial-gradient(ellipse at top left, ${f.gradientFrom} 0%, #0c0c0c 65%)`,
          border: '1px solid #1e1e1e',
          borderRadius: '20px',
          padding: '1.75rem',
          height: '100%',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = f.border
          e.currentTarget.style.boxShadow = `0 0 0 1px ${f.border}55, 0 12px 40px ${f.accent}10`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1e1e1e'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: f.accent, marginBottom: '1rem', opacity: 0.65 }}>
          {f.label}
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.85rem' }}>{f.icon}</div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '500', marginBottom: '0.5rem', color: '#ebebeb' }}>
          {f.title}
        </h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.68', marginBottom: '1.25rem' }}>
          {f.description}
        </p>
        <span style={{ fontSize: '12px', color: f.accent }}>{f.cta} →</span>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>

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

      {/* Interlinear — featured full-width card */}
      <Link href="/interlinear" style={{ display: 'block', marginBottom: '14px' }}>
        <div
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(26,10,0,0.95) 0%, #0c0c0c 60%)',
            border: '1px solid #1e1e1e',
            borderRadius: '20px',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#9a3412'
            e.currentTarget.style.boxShadow = '0 0 0 1px #9a341255, 0 12px 40px #f9731610'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1e1e1e'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Script display */}
          <div style={{
            flexShrink: 0,
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            background: 'rgba(249,115,22,0.07)',
            border: '1px solid #9a341230',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}>
            <span style={{ fontSize: '18px', color: '#f97316', opacity: 0.9, fontFamily: 'Georgia, serif', lineHeight: 1 }}>Αα</span>
            <span style={{ fontSize: '14px', color: '#f97316', opacity: 0.7, fontFamily: 'Georgia, serif', lineHeight: 1 }}>אב</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', color: '#f97316', marginBottom: '0.5rem', opacity: 0.65 }}>
              SCHOLARLY
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '500', color: '#ebebeb', marginBottom: '0.4rem' }}>
              Interlinear — Greek & Hebrew
            </h2>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.65' }}>
              Word-by-word original language study with transliteration, Strong's numbers, and grammatical parsing for any verse in the Bible.
            </p>
          </div>

          <span style={{ fontSize: '13px', color: '#f97316', flexShrink: 0, paddingRight: '0.25rem' }}>
            Explore →
          </span>
        </div>
      </Link>

      {/* 2×3 feature grid */}
      <div className="grid-2" style={{ gap: '14px' }}>
        {FEATURES.map(f => <FeatureCard key={f.href} f={f} />)}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #141414' }}>
        <p style={{ fontSize: '12px', color: '#3a3a3a' }}>
          Built with care ·{' '}
          <a href="mailto:hello@selah.ai" style={{ color: '#484848' }}>Contact</a>
        </p>
      </div>

    </div>
  )
}
