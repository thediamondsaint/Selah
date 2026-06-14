'use client'

import { useState } from 'react'

const PRESETS = ['John 3:16', 'Psalm 23', 'Romans 8:28', 'Hebrews 11:1', 'Isaiah 40:31', 'Proverbs 3:5-6']

const LEVELS = [
  { id: 'child', label: 'Child (age 8)' },
  { id: 'teen', label: 'Teen (age 14)' },
  { id: 'adult', label: 'Adult' },
  { id: 'simple', label: 'Simple English' },
]

const LEVEL_PROMPTS: Record<string, string> = {
  child: 'Rewrite this Bible verse for an 8-year-old child. Use very short sentences, everyday words a child would know, and a warm friendly tone. No religious jargon at all.',
  teen: 'Rewrite this Bible verse for a 14-year-old teenager. Use clear modern English and relatable language. Avoid archaic words but keep the full meaning.',
  adult: 'Rewrite this Bible verse in clear modern everyday English for an adult. Remove archaic language (thee, thou, hath) while preserving the full meaning and tone.',
  simple: 'Rewrite this Bible verse using only very simple basic English words. Short sentences, one idea at a time, no complex vocabulary.',
}

export default function PlainPage() {
  const [ref, setRef] = useState('')
  const [level, setLevel] = useState('teen')
  const [original, setOriginal] = useState('')
  const [plain, setPlain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function translate(verseRef: string) {
    setLoading(true)
    setError('')
    setPlain('')
    setOriginal('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a Bible scholar. When asked, first provide the KJV text of a verse, then rewrite it. Always respond in valid JSON only — no markdown, no extra text.',
          prompt: `For the Bible passage "${verseRef}", respond with this exact JSON shape:
{
  "ref": "the reference e.g. John 3:16",
  "kjv": "the full KJV text",
  "plain": "the rewritten version"
}

Rewrite instruction: ${LEVEL_PROMPTS[level]}

Respond with ONLY the JSON object.`,
        }),
      })

      const data = await res.json()
      const parsed = JSON.parse(data.text)
      setOriginal(parsed.kjv)
      setPlain(parsed.plain)
      setRef(parsed.ref)
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (ref.trim()) translate(ref.trim())
  }

  function handleCopy() {
    navigator.clipboard.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <a href="/" style={{ color: '#888', fontSize: '14px' }}>← Back</a>

      <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: '1.5rem 0 0.5rem' }}>Plain Language</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Any verse, in language anyone can understand.</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a verse — e.g. John 3:16, Psalm 23"
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#f0f0f0', fontSize: '15px' }}
        />
        <button
          onClick={handleGo}
          disabled={loading}
          style={{ padding: '10px 20px', borderRadius: '8px', background: '#4ade80', color: '#000', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Loading...' : 'Translate'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {LEVELS.map(l => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{ padding: '5px 14px', borderRadius: '999px', border: `1px solid ${level === l.id ? '#4ade80' : '#333'}`, background: level === l.id ? '#052e16' : 'transparent', color: level === l.id ? '#4ade80' : '#888', fontSize: '13px', cursor: 'pointer' }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setRef(p); translate(p) }}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#888', fontSize: '12px', cursor: 'pointer' }}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: '#f87171', background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '14px' }}>{error}</p>
      )}

      {(original || loading) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', letterSpacing: '0.06em' }}>ORIGINAL — KJV</p>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#ccc', fontStyle: 'italic' }}>{original}</p>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', letterSpacing: '0.06em' }}>PLAIN LANGUAGE</p>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[90, 75, 85].map((w, i) => (
                  <div key={i} style={{ height: '14px', width: `${w}%`, background: '#2a2a2a', borderRadius: '4px' }} />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#f0f0f0' }}>{plain}</p>
            )}
          </div>
        </div>
      )}

      {plain && (
        <button
          onClick={handleCopy}
          style={{ fontSize: '13px', padding: '6px 16px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#888', cursor: 'pointer' }}
        >
          {copied ? '✓ Copied' : 'Copy plain text'}
        </button>
      )}
    </main>
  )
}