'use client'

import { useState } from 'react'

const SUGGESTIONS = [
  'feeling anxious and afraid',
  'hope in dark times',
  'forgiveness and letting go',
  'finding purpose',
  'grief and loss',
  'strength when tired',
  'trusting God\'s plan',
  'overcoming temptation',
]

type Verse = { ref: string; text: string; relevance: string }

const ACCENT = '#22d3ee'
const ACCENT_BG = '#001c20'
const ACCENT_BORDER = '#164e63'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Verse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState('')

  async function search(q?: string) {
    const text = (q ?? query).trim()
    if (!text || loading) return
    setLoading(true)
    setError('')
    setResults([])
    setSearched(text)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a Bible scholar with encyclopedic knowledge of scripture. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Find 6 Bible verses most relevant to: "${text}"

Choose verses that genuinely speak to this feeling, theme, or situation — not just superficially keyword-related. Include a mix of Old and New Testament when possible.

Respond with ONLY this JSON:
{
  "verses": [
    {
      "ref": "John 14:27",
      "text": "the full KJV verse text",
      "relevance": "one sentence explaining why this verse speaks to the query"
    }
  ]
}`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed = JSON.parse(data.text)
      setResults(parsed.verses)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Semantic Search</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Find verses by feeling or theme, not just keywords.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Describe what you're looking for…"
          style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={() => search()}
          disabled={loading || !query.trim()}
          style={{ padding: '11px 22px', borderRadius: '10px', background: ACCENT, color: '#001c20', fontWeight: '600', border: 'none', cursor: (loading || !query.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !query.trim()) ? 0.45 : 1, fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); search(s) }}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '11px', width: '22%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.08}s ease-in-out infinite` }} />
              <div style={{ height: '13px', width: '92%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.08 + 0.1}s ease-in-out infinite` }} />
              <div style={{ height: '13px', width: '75%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.08 + 0.2}s ease-in-out infinite` }} />
              <div style={{ height: '12px', width: '60%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.08 + 0.3}s ease-in-out infinite` }} />
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.14em', marginBottom: '1rem' }}>
            {results.length} VERSES FOR "{searched.toUpperCase()}"
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((v, i) => (
              <div
                key={i}
                style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1.25rem', transition: 'border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT_BORDER }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a' }}
              >
                <p style={{ fontSize: '11px', color: ACCENT, fontWeight: '500', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  {v.ref}
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.85', color: '#bbb', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                  "{v.text}"
                </p>
                <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.55' }}>{v.relevance}</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
