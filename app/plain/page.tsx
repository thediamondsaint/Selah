'use client'

import { useState } from 'react'

const PRESETS = ['John 3:16', 'Psalm 23', 'Romans 8:28', 'Hebrews 11:1', 'Isaiah 40:31', 'Proverbs 3:5-6']

const LEVELS = [
  { id: 'child', label: 'Child', sub: '8+' },
  { id: 'teen', label: 'Teen', sub: '14+' },
  { id: 'adult', label: 'Adult', sub: '' },
  { id: 'simple', label: 'Simple', sub: 'ESL' },
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
  const [displayRef, setDisplayRef] = useState('')
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
    setDisplayRef('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a Bible scholar. Always respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `For the Bible passage "${verseRef}", respond with this exact JSON shape:
{
  "ref": "the canonical reference e.g. John 3:16",
  "kjv": "the full KJV text",
  "plain": "the rewritten version"
}

Rewrite instruction: ${LEVEL_PROMPTS[level]}

Respond with ONLY the JSON object.`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed = JSON.parse(data.text)
      setDisplayRef(parsed.ref)
      setOriginal(parsed.kjv)
      setPlain(parsed.plain)
      setRef(parsed.ref)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please check the verse reference and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (ref.trim() && !loading) translate(ref.trim())
  }

  function handleCopy() {
    navigator.clipboard.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>
          Plain Language
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Any verse, in language anyone can understand.
        </p>
      </div>

      {/* Level selector */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '1.25rem',
        background: '#111',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #1e1e1e',
      }}>
        {LEVELS.map(l => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '7px',
              border: 'none',
              background: level === l.id ? '#052e16' : 'transparent',
              color: level === l.id ? '#4ade80' : '#555',
              fontSize: '12px',
              fontWeight: level === l.id ? '500' : '400',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {l.label}
            {l.sub && (
              <span style={{ opacity: 0.55, fontSize: '11px' }}> · {l.sub}</span>
            )}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a verse — e.g. John 3:16 or Psalm 23"
          style={{
            flex: 1,
            padding: '11px 16px',
            borderRadius: '10px',
            border: '1px solid #252525',
            background: '#111',
            color: '#f0f0f0',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={handleGo}
          disabled={loading || !ref.trim()}
          style={{
            padding: '11px 22px',
            borderRadius: '10px',
            background: '#4ade80',
            color: '#021a0d',
            fontWeight: '600',
            border: 'none',
            cursor: (loading || !ref.trim()) ? 'not-allowed' : 'pointer',
            opacity: (loading || !ref.trim()) ? 0.45 : 1,
            fontSize: '14px',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Loading…' : 'Translate'}
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setRef(p); translate(p) }}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid #1e1e1e',
              background: '#0d0d0d',
              color: '#666',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#2e2e2e'
              e.currentTarget.style.color = '#888'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1e1e1e'
              e.currentTarget.style.color = '#666'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          color: '#f87171',
          background: '#180808',
          border: '1px solid #3f0f0f',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '1.5rem',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {(original || loading) && (
        <>
          {displayRef && (
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: '#444',
              marginBottom: '0.75rem',
            }}>
              {displayRef.toUpperCase()}
            </p>
          )}

          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            {/* KJV */}
            <div style={{
              background: '#0c0c0c',
              border: '1px solid #1a1a1a',
              borderRadius: '16px',
              padding: '1.5rem',
            }}>
              <p style={{ fontSize: '10px', color: '#3a3a3a', marginBottom: '0.75rem', letterSpacing: '0.14em' }}>
                KING JAMES VERSION
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.9', color: '#888', fontStyle: 'italic' }}>
                {loading && !original ? (
                  <span style={{ color: '#333' }}>—</span>
                ) : original}
              </p>
            </div>

            {/* Plain */}
            <div style={{
              background: '#0c0c0c',
              border: '1px solid #1a1a1a',
              borderRadius: '16px',
              padding: '1.5rem',
            }}>
              <p style={{ fontSize: '10px', color: '#14532d', marginBottom: '0.75rem', letterSpacing: '0.14em' }}>
                PLAIN LANGUAGE
              </p>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '2px' }}>
                  {[88, 72, 80, 55].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: '12px',
                        width: `${w}%`,
                        background: '#1a1a1a',
                        borderRadius: '4px',
                        animation: `shimmer 1.6s ${i * 0.15}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '14px', lineHeight: '1.9', color: '#e8e8e8' }}>
                  {plain}
                </p>
              )}
            </div>
          </div>

          {plain && (
            <button
              onClick={handleCopy}
              style={{
                fontSize: '12px',
                padding: '6px 16px',
                borderRadius: '8px',
                border: '1px solid #1e1e1e',
                background: 'transparent',
                color: copied ? '#4ade80' : '#555',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy plain text'}
            </button>
          )}
        </>
      )}

    </div>
  )
}
