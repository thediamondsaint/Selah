'use client'

import { useState } from 'react'

const PRESETS = [
  { word: 'agape', hint: 'Greek · love' },
  { word: 'shalom', hint: 'Hebrew · peace' },
  { word: 'logos', hint: 'Greek · word' },
  { word: 'hesed', hint: 'Hebrew · lovingkindness' },
  { word: 'pneuma', hint: 'Greek · spirit' },
  { word: 'grace', hint: 'English' },
]

type Occurrence = { ref: string; note: string }

type WordStudy = {
  word: string
  original: string
  transliteration: string
  language: 'Greek' | 'Hebrew'
  strongs: string
  short_def: string
  definition: string
  semantic_range: string[]
  occurrences: Occurrence[]
  related: string[]
  significance: string
}

const ACCENT = '#2dd4bf'
const ACCENT_BG = '#00201d'
const ACCENT_BORDER = '#115e59'

export default function WordStudyPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<WordStudy | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function study(word: string) {
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a biblical lexicographer with deep expertise in Koine Greek and Biblical Hebrew. Provide accurate, scholarly word studies grounded in standard lexicons (BDAG, HALOT, Strong\'s). Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Provide a complete word study for: "${word}"

If an English word is given, study the most significant underlying Greek or Hebrew term. If a transliterated or original-script word is given, study that exact word.

Respond with ONLY this JSON:
{
  "word": "the headword being studied",
  "original": "the word in Greek or Hebrew script",
  "transliteration": "academic romanization",
  "language": "Greek",
  "strongs": "G#### or H####",
  "short_def": "the core meaning in 1-3 words",
  "definition": "a full lexical definition (2-4 sentences)",
  "semantic_range": ["distinct sense 1", "distinct sense 2", "distinct sense 3"],
  "occurrences": [
    { "ref": "1 Corinthians 13:4", "note": "how the word is used here, one sentence" }
  ],
  "related": ["related word 1", "related word 2"],
  "significance": "theological or interpretive significance (2-4 sentences)"
}

Include 4-6 key occurrences spanning different books where possible.`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed: WordStudy = JSON.parse(data.text)
      setResult(parsed)
      setInput(parsed.word)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (input.trim() && !loading) study(input.trim())
  }

  const isHebrew = result?.language === 'Hebrew'

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Word Study</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Trace any Greek or Hebrew word through scripture.</p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a word — e.g. agape, shalom, or grace"
          style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={handleGo}
          disabled={loading || !input.trim()}
          style={{ padding: '11px 24px', borderRadius: '10px', background: ACCENT, color: '#00201d', fontWeight: '600', border: 'none', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !input.trim()) ? 0.45 : 1, fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
        >
          {loading ? 'Loading…' : 'Study'}
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PRESETS.map(p => (
          <button
            key={p.word}
            onClick={() => { setInput(p.word); study(p.word) }}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}
          >
            {p.word} <span style={{ color: '#3a3a3a' }}>· {p.hint.split(' · ')[0]}</span>
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
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ height: '32px', width: '40%', background: '#1a1a1a', borderRadius: '6px', animation: 'shimmer 1.6s ease-in-out infinite' }} />
            <div style={{ height: '13px', width: '90%', background: '#161616', borderRadius: '4px', animation: 'shimmer 1.6s 0.1s ease-in-out infinite' }} />
            <div style={{ height: '13px', width: '75%', background: '#161616', borderRadius: '4px', animation: 'shimmer 1.6s 0.2s ease-in-out infinite' }} />
          </div>
          {[1, 2].map(i => (
            <div key={i} style={{ height: '80px', background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', animation: `shimmer 1.6s ${i * 0.15}s ease-in-out infinite` }} />
          ))}
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Headword card */}
          <div style={{
            background: `radial-gradient(ellipse at top left, ${ACCENT_BG} 0%, #0c0c0c 65%)`,
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: '16px',
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
              <div
                dir={isHebrew ? 'rtl' : 'ltr'}
                style={{ fontSize: '2rem', color: '#f0f0f0', fontFamily: isHebrew ? 'Georgia, serif' : 'inherit' }}
              >
                {result.original}
              </div>
              <span style={{ fontSize: '11px', padding: '3px 12px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, letterSpacing: '0.06em' }}>
                {result.language} · {result.strongs}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: ACCENT, fontStyle: 'italic', marginBottom: '2px' }}>
              {result.transliteration} — “{result.short_def}”
            </p>
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.8', marginTop: '0.75rem' }}>
              {result.definition}
            </p>
          </div>

          {/* Semantic range */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>SEMANTIC RANGE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {result.semantic_range.map((sense, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontSize: '12px', fontFamily: 'var(--font-geist-mono)', flexShrink: 0, paddingTop: '1px' }}>{i + 1}</span>
                  <span style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.65' }}>{sense}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Occurrences */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.85rem' }}>KEY OCCURRENCES</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {result.occurrences.map((occ, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', color: ACCENT, fontWeight: '500', flexShrink: 0, paddingTop: '2px', minWidth: '110px' }}>{occ.ref}</span>
                  <span style={{ fontSize: '13px', color: '#888', lineHeight: '1.6' }}>{occ.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Significance + related */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>SIGNIFICANCE</p>
            <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.8', marginBottom: result.related?.length ? '1.25rem' : 0 }}>
              {result.significance}
            </p>
            {result.related?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#444' }}>Related:</span>
                {result.related.map(r => (
                  <button
                    key={r}
                    onClick={() => { setInput(r); study(r) }}
                    style={{ padding: '3px 11px', borderRadius: '999px', border: `1px solid ${ACCENT_BORDER}`, background: ACCENT_BG, color: ACCENT, fontSize: '12px', cursor: 'pointer' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
