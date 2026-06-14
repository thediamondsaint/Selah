'use client'

import { useState } from 'react'

const PRESETS = ['John 3:16', 'Psalm 23:1', 'Romans 8:28', 'Isaiah 40:31', 'Hebrews 11:1', 'Proverbs 3:5-6']

const ALL_TRANSLATIONS = [
  { id: 'kjv',  name: 'KJV',  full: 'King James Version',          year: '1611' },
  { id: 'nkjv', name: 'NKJV', full: 'New King James Version',      year: '1982' },
  { id: 'esv',  name: 'ESV',  full: 'English Standard Version',    year: '2001' },
  { id: 'niv',  name: 'NIV',  full: 'New International Version',   year: '2011' },
  { id: 'nasb', name: 'NASB', full: 'New American Standard Bible', year: '2020' },
  { id: 'nlt',  name: 'NLT',  full: 'New Living Translation',      year: '2015' },
  { id: 'csb',  name: 'CSB',  full: 'Christian Standard Bible',    year: '2017' },
  { id: 'msg',  name: 'MSG',  full: 'The Message',                 year: '2002' },
  { id: 'amp',  name: 'AMP',  full: 'Amplified Bible',             year: '2015' },
]

type Translation = { id: string; name: string; full: string; year: string; text: string }
type Result = { ref: string; translations: Translation[] }

const ACCENT = '#38bdf8'
const ACCENT_BG = '#001826'
const ACCENT_BORDER = '#075985'

export default function ComparePage() {
  const [ref, setRef] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState<string | null>(null)

  async function compare(verseRef: string) {
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)
    setHidden(new Set())

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a Bible scholar with thorough knowledge of all major English Bible translations. Provide accurate translation texts. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Provide the text of "${verseRef}" from these 9 Bible translations: KJV, NKJV, ESV, NIV, NASB, NLT, CSB, MSG, AMP.

If the reference spans multiple verses, include all of them for each translation.

Respond with ONLY this JSON:
{
  "ref": "the canonical reference e.g. John 3:16",
  "translations": [
    { "id": "kjv",  "name": "KJV",  "full": "King James Version",          "year": "1611", "text": "..." },
    { "id": "nkjv", "name": "NKJV", "full": "New King James Version",      "year": "1982", "text": "..." },
    { "id": "esv",  "name": "ESV",  "full": "English Standard Version",    "year": "2001", "text": "..." },
    { "id": "niv",  "name": "NIV",  "full": "New International Version",   "year": "2011", "text": "..." },
    { "id": "nasb", "name": "NASB", "full": "New American Standard Bible", "year": "2020", "text": "..." },
    { "id": "nlt",  "name": "NLT",  "full": "New Living Translation",      "year": "2015", "text": "..." },
    { "id": "csb",  "name": "CSB",  "full": "Christian Standard Bible",    "year": "2017", "text": "..." },
    { "id": "msg",  "name": "MSG",  "full": "The Message",                 "year": "2002", "text": "..." },
    { "id": "amp",  "name": "AMP",  "full": "Amplified Bible",             "year": "2015", "text": "..." }
  ]
}`,
          }],
        }),
      })

      const data = await res.json()
      const parsed: Result = JSON.parse(data.text)
      setResult(parsed)
      setRef(parsed.ref)
    } catch {
      setError('Something went wrong. Please check the reference and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (ref.trim() && !loading) compare(ref.trim())
  }

  function toggleHidden(id: string) {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const visible = result?.translations.filter(t => !hidden.has(t.id)) ?? []

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>
          Verse Comparison
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>
          See any verse across 9 major translations side by side.
        </p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a verse — e.g. John 3:16 or Romans 8:28"
          style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={handleGo}
          disabled={loading || !ref.trim()}
          style={{ padding: '11px 24px', borderRadius: '10px', background: ACCENT, color: '#001826', fontWeight: '600', border: 'none', cursor: (loading || !ref.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !ref.trim()) ? 0.45 : 1, fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
        >
          {loading ? 'Loading…' : 'Compare'}
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setRef(p); compare(p) }}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid-2" style={{ gap: '10px' }}>
          {ALL_TRANSLATIONS.map((t, i) => (
            <div key={t.id} style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ height: '18px', width: '40px', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.06}s ease-in-out infinite` }} />
                <div style={{ height: '11px', width: '120px', background: '#161616', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.06 + 0.05}s ease-in-out infinite` }} />
              </div>
              {[85, 92, 78, 65].map((w, j) => (
                <div key={j} style={{ height: '13px', width: `${w}%`, background: '#161616', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.06 + j * 0.05}s ease-in-out infinite` }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <>
          {/* Ref + translation toggles */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '0.85rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f0f0f0' }}>{result.ref}</h2>
              <span style={{ fontSize: '11px', color: '#444' }}>
                {visible.length} of {result.translations.length} translations
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {result.translations.map(t => {
                const active = !hidden.has(t.id)
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleHidden(t.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: `1px solid ${active ? ACCENT_BORDER : '#1e1e1e'}`,
                      background: active ? ACCENT_BG : 'transparent',
                      color: active ? ACCENT : '#444',
                      fontSize: '11px',
                      fontWeight: active ? '500' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Translation cards */}
          <div className="grid-2" style={{ gap: '10px' }}>
            {visible.map(t => (
              <div
                key={t.id}
                style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'border-color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#252525' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a' }}
              >
                {/* Translation header */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: ACCENT }}>{t.name}</span>
                    <span style={{ fontSize: '11px', color: '#3a3a3a', marginLeft: '8px' }}>{t.full} · {t.year}</span>
                  </div>
                  <button
                    onClick={() => copyText(t.id, t.text)}
                    style={{ fontSize: '11px', color: copied === t.id ? ACCENT : '#444', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'color 0.15s', padding: '0' }}
                  >
                    {copied === t.id ? '✓' : 'Copy'}
                  </button>
                </div>

                {/* Verse text */}
                <p style={{ fontSize: '14px', lineHeight: '1.85', color: '#c0c0c0', fontStyle: 'italic' }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
