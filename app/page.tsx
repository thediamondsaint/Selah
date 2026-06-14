'use client'
import Link from 'next/link'
import { Logo } from './components/Logo'
import { FEATURES, CATEGORIES, type Feature } from './features'

const CATEGORY_BLURB: Record<Feature['category'], string> = {
  Study: 'Go deep into the text — languages, translations, and exposition.',
  Read: 'Meet scripture where you are, at your own pace.',
  Reflect: 'Carry the word into prayer and everyday life.',
}

function FeatureCard({ f }: { f: Feature }) {
  return (
    <Link href={f.href} style={{ display: 'block' }}>
      <div
        style={{
          background: `radial-gradient(ellipse at top left, ${f.gradientFrom} 0%, #0c0c0c 65%)`,
          border: '1px solid #1e1e1e',
          borderRadius: '18px',
          padding: '1.5rem',
          height: '100%',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = f.border
          e.currentTarget.style.boxShadow = `0 0 0 1px ${f.border}55, 0 14px 44px ${f.accent}12`
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1e1e1e'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: f.gradientFrom,
          border: `1px solid ${f.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '17px',
          marginBottom: '1rem',
        }}>
          {f.icon}
        </div>
        <h3 style={{ fontSize: '1.02rem', fontWeight: '500', marginBottom: '0.45rem', color: '#ebebeb' }}>
          {f.title}
        </h3>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.65', marginBottom: '1.1rem' }}>
          {f.description}
        </p>
        <span style={{ fontSize: '12px', color: f.accent }}>{f.cta} →</span>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4.5rem 1.5rem 6rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <div style={{
          display: 'inline-flex',
          marginBottom: '1.75rem',
          filter: 'drop-shadow(0 6px 22px rgba(129,140,248,0.28))',
        }}>
          <Logo size={52} />
        </div>
        <h1 style={{
          fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
          fontWeight: '600',
          lineHeight: '1.12',
          marginBottom: '1.25rem',
          color: '#f5f5f5',
          letterSpacing: '-0.03em',
        }}>
          Understand the Bible<br />like never before
        </h1>
        <p style={{ color: '#777', fontSize: '1.05rem', maxWidth: '440px', margin: '0 auto', lineHeight: '1.75' }}>
          A complete suite of AI-powered tools for deeper scripture study — from the original languages to your daily devotion.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <Link href="/tutor" style={{
            padding: '10px 22px',
            borderRadius: '10px',
            background: '#818cf8',
            color: '#09090f',
            fontWeight: '600',
            fontSize: '14px',
          }}>
            Start studying
          </Link>
          <Link href="/interlinear" style={{
            padding: '10px 22px',
            borderRadius: '10px',
            background: '#111',
            border: '1px solid #252525',
            color: '#ccc',
            fontWeight: '500',
            fontSize: '14px',
          }}>
            Explore the languages
          </Link>
        </div>
      </div>

      {/* Feature sections by category */}
      {CATEGORIES.map(cat => (
        <section key={cat} style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.1rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#d0d0d0', letterSpacing: '0.01em' }}>
              {cat}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#555', marginTop: '2px' }}>
              {CATEGORY_BLURB[cat]}
            </p>
          </div>
          <div className="grid-2" style={{ gap: '12px' }}>
            {FEATURES.filter(f => f.category === cat).map(f => (
              <FeatureCard key={f.href} f={f} />
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #141414' }}>
        <div style={{ display: 'inline-flex', marginBottom: '0.75rem', opacity: 0.5 }}>
          <Logo size={20} />
        </div>
        <p style={{ fontSize: '12px', color: '#3a3a3a' }}>
          Built with care ·{' '}
          <a href="mailto:hello@selah.ai" style={{ color: '#484848' }}>Contact</a>
        </p>
      </div>

    </div>
  )
}
