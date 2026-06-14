'use client'

import { useState } from 'react'

const PRESETS = ['John 1:1-14', 'Psalm 23', 'Romans 8:28-39', 'Genesis 1:1-5', 'Matthew 5:1-12', 'Philippians 2:5-11']

type StructureItem = { label: string; summary: string }
type KeyTerm = { term: string; explanation: string }

type Commentary = {
  ref: string
  overview: string
  context: string
  structure: StructureItem[]
  key_terms: KeyTerm[]
  interpretation: string
  application: string
}

const ACCENT = '#eab308'
const ACCENT_BG = '#1a1400'
const ACCENT_BORDER = '#854d0e'

export default function CommentaryPage() {
  const [ref, setRef] = useState('')
  const [result, setResult] = useState<Commentary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load(passage: string) {
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a seminary-trained biblical scholar writing accessible, non-denominational commentary grounded in sound exegesis, historical context, and the original languages. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Write a scholarly commentary on: "${passage}"

Respond with ONLY this JSON:
{
  "ref": "the canonical reference",
  "overview": "a 2-3 sentence summary of the passage and its main point",
  "context": "historical, literary, and canonical context (3-4 sentences)",
  "structure": [
    { "label": "v.1-3", "summary": "what this section does, one sentence" }
  ],
  "key_terms": [
    { "term": "the word or phrase", "explanation": "its meaning and significance, 1-2 sentences" }
  ],
  "interpretation": "the core interpretive insight and how the passage has been understood (4-6 sentences)",
  "application": "how this passage speaks to readers today (2-3 sentences)"
}

Include 2-4 structure sections and 2-4 key terms.`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed: Commentary = JSON.parse(data.text)
      setResult(parsed)
      setRef(parsed.ref)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (ref.trim() && !loading) load(ref.trim())
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Commentary</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Scholarly verse-by-verse exposition of any passage.</p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a passage — e.g. John 1:1-14 or Psalm 23"
          style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={handleGo}
          disabled={loading || !ref.trim()}
          style={{ padding: '11px 24px', borderRadius: '10px', background: ACCENT, color: '#1a1400', fontWeight: '600', border: 'none', cursor: (loading || !ref.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !ref.trim()) ? 0.45 : 1, fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
        >
          {loading ? 'Loading…' : 'Expound'}
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setRef(p); load(p) }}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[60, 100, 80].map((w, i) => (
            <div key={i} style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '11px', width: '25%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.12}s ease-in-out infinite` }} />
              <div style={{ height: '13px', width: `${w}%`, background: '#161616', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.12 + 0.1}s ease-in-out infinite` }} />
              <div style={{ height: '13px', width: `${w - 20}%`, background: '#161616', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.12 + 0.2}s ease-in-out infinite` }} />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Overview */}
          <div style={{
            background: `radial-gradient(ellipse at top left, ${ACCENT_BG} 0%, #0c0c0c 65%)`,
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: '16px',
            padding: '1.75rem',
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '0.75rem' }}>{result.ref}</h2>
            <p style={{ fontSize: '14px', color: '#cfcfcf', lineHeight: '1.85' }}>{result.overview}</p>
          </div>

          {/* Context */}
          <Section title="CONTEXT">
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.85' }}>{result.context}</p>
          </Section>

          {/* Structure */}
          <Section title="STRUCTURE">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.structure.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', color: ACCENT, fontWeight: '500', fontFamily: 'var(--font-geist-mono)', flexShrink: 0, paddingTop: '2px', minWidth: '64px' }}>{s.label}</span>
                  <span style={{ fontSize: '13px', color: '#999', lineHeight: '1.7' }}>{s.summary}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Key terms */}
          <Section title="KEY TERMS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {result.key_terms.map((t, i) => (
                <div key={i}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: ACCENT, marginBottom: '3px' }}>{t.term}</p>
                  <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.7' }}>{t.explanation}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Interpretation */}
          <Section title="INTERPRETATION">
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.85' }}>{result.interpretation}</p>
          </Section>

          {/* Application */}
          <div style={{ background: '#0a0a0a', border: `1px solid ${ACCENT_BORDER}`, borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.12em', marginBottom: '0.75rem', opacity: 0.8 }}>FOR TODAY</p>
            <p style={{ fontSize: '14px', color: '#bbb', lineHeight: '1.85' }}>{result.application}</p>
          </div>

        </div>
      )}

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
      <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.85rem' }}>{title}</p>
      {children}
    </div>
  )
}
