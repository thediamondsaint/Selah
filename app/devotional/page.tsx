'use client'

import { useState } from 'react'

const THEMES = ['Hope', 'Strength', 'Peace', 'Gratitude', 'Wisdom', 'Love', 'Forgiveness', 'Faith']

type Devotional = {
  passage_ref: string
  passage_text: string
  title: string
  paragraphs: string[]
  prayer: string
}

const ACCENT = '#fb7185'
const ACCENT_BG = '#1a0010'
const ACCENT_BORDER = '#9f1239'

export default function DevotionalPage() {
  const [theme, setTheme] = useState('')
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  async function generate() {
    setLoading(true)
    setError('')
    setDevotional(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a thoughtful, non-denominational devotional writer with deep knowledge of scripture. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Write a daily devotional${theme ? ` on the theme of "${theme}"` : ''} for today (${today}).

Respond with ONLY this JSON:
{
  "passage_ref": "e.g. Isaiah 40:31",
  "passage_text": "the full KJV verse(s)",
  "title": "devotional title — 5 to 8 words",
  "paragraphs": [
    "first paragraph of reflection (3–5 sentences)",
    "second paragraph (3–5 sentences)",
    "third paragraph (3–5 sentences)"
  ],
  "prayer": "a sincere closing prayer (3–5 sentences, first person)"
}`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setDevotional(JSON.parse(data.text))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Daily Devotional</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>{today}</p>
      </div>

      {/* Theme picker */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.6rem' }}>THEME — OPTIONAL</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {THEMES.map(t => (
            <button
              key={t}
              onClick={() => setTheme(theme === t ? '' : t)}
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                border: `1px solid ${theme === t ? ACCENT_BORDER : '#1e1e1e'}`,
                background: theme === t ? ACCENT_BG : '#0d0d0d',
                color: theme === t ? ACCENT : '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#1a0010', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontSize: '14px', marginBottom: '2rem', transition: 'opacity 0.15s' }}
      >
        {loading ? 'Writing your devotional…' : devotional ? 'Generate another' : 'Generate devotional'}
      </button>

      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[38, 72, 58, 85, 48, 68, 42, 78, 52, 62, 38, 70].map((w, i) => (
            <div
              key={i}
              style={{ height: '13px', width: `${w}%`, background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${(i % 4) * 0.12}s ease-in-out infinite` }}
            />
          ))}
        </div>
      )}

      {devotional && !loading && (
        <div style={{ background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>

          {/* Passage */}
          <div style={{
            padding: '1.75rem',
            borderBottom: '1px solid #141414',
            background: `linear-gradient(135deg, ${ACCENT_BG} 0%, #0c0c0c 70%)`,
          }}>
            <p style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.14em', marginBottom: '1rem', opacity: 0.7 }}>
              TODAY'S PASSAGE
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.95', color: '#c0b0b8', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              "{devotional.passage_text}"
            </p>
            <p style={{ fontSize: '12px', color: ACCENT }}>— {devotional.passage_ref}</p>
          </div>

          {/* Reflection */}
          <div style={{ padding: '1.75rem', borderBottom: '1px solid #141414' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1.25rem', lineHeight: '1.45' }}>
              {devotional.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {devotional.paragraphs.map((para, i) => (
                <p key={i} style={{ fontSize: '14px', lineHeight: '1.85', color: '#aaa' }}>{para}</p>
              ))}
            </div>
          </div>

          {/* Prayer */}
          <div style={{ padding: '1.75rem', background: '#0a0a0a' }}>
            <p style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.14em', marginBottom: '0.75rem', opacity: 0.7 }}>
              CLOSING PRAYER
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.85', color: '#888', fontStyle: 'italic' }}>
              {devotional.prayer}
            </p>
          </div>

        </div>
      )}

    </div>
  )
}
