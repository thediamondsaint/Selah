'use client'

import { useState } from 'react'
import { useProfile } from '../profile/ProfileContext'
import { buildPersona } from '../profile/profile'

const TYPES = [
  { id: 'personal', label: 'Personal', desc: 'For your own heart and needs' },
  { id: 'intercessory', label: 'Intercessory', desc: 'Praying for others' },
  { id: 'thanksgiving', label: 'Thanksgiving', desc: 'Gratitude and praise' },
  { id: 'confession', label: 'Confession', desc: 'Repentance and renewal' },
]

const EXAMPLES = [
  'John 14:27', 'Psalm 23', 'Philippians 4:6-7', 'Isaiah 41:10', 'Romans 8:28',
]

const ACCENT = '#c084fc'
const ACCENT_BG = '#130020'
const ACCENT_BORDER = '#6b21a8'

export default function PrayerPage() {
  const { profile } = useProfile()
  const [input, setInput] = useState('')
  const [type, setType] = useState('personal')
  const [prayer, setPrayer] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const typeDesc = TYPES.find(t => t.id === type)?.desc ?? ''

  async function generate() {
    if (!input.trim() || loading || streaming) return
    setLoading(true)
    setError('')
    setPrayer('')

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are a prayer writer who crafts sincere, heartfelt, scripturally-grounded prayers. Write in first person, speaking directly to God. Do not begin with "Dear God" or "Heavenly Father" — open with something more intimate and specific. Avoid clichés.${buildPersona(profile)}`,
          messages: [{
            role: 'user',
            content: `Write a ${type} prayer (${typeDesc}) based on: "${input}"

Write 4–6 sentences. Make it sincere, personal, and rooted in what was provided. Speak directly to God.`,
          }],
          stream: true,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      setLoading(false)
      setStreaming(true)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setPrayer(prev => prev + chunk)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(prayer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Prayer Generator</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Turn any passage or situation into a personal prayer.</p>
      </div>

      {/* Prayer type */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.6rem' }}>TYPE OF PRAYER</p>
        <div className="grid-2" style={{ gap: '8px' }}>
          {TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                border: `1px solid ${type === t.id ? ACCENT_BORDER : '#1e1e1e'}`,
                background: type === t.id ? ACCENT_BG : '#0d0d0d',
                color: type === t.id ? ACCENT : '#666',
                fontSize: '13px',
                fontWeight: type === t.id ? '500' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div>{t.label}</div>
              <div style={{ fontSize: '11px', opacity: 0.55, marginTop: '2px' }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.6rem' }}>PASSAGE OR SITUATION</p>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter a verse reference or describe what's on your heart…"
          rows={3}
          style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: '1.65', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              style={{ padding: '3px 10px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '11px', cursor: 'pointer' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || streaming || !input.trim()}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#0d0020', fontWeight: '600', border: 'none', cursor: (loading || streaming || !input.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || streaming || !input.trim()) ? 0.45 : 1, fontSize: '14px', marginBottom: '2rem', transition: 'opacity 0.15s' }}
      >
        {loading || streaming ? 'Writing your prayer…' : prayer ? 'Write another' : 'Write prayer'}
      </button>

      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {(prayer || loading) && (
        <div style={{
          background: `radial-gradient(ellipse at top, ${ACCENT_BG} 0%, #0c0c0c 65%)`,
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: '16px',
          padding: '1.75rem',
        }}>
          <p style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.14em', marginBottom: '1.25rem', opacity: 0.7 }}>
            YOUR PRAYER
          </p>
          {loading ? (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: '5px', height: '5px', borderRadius: '50%', background: ACCENT, opacity: 0.5, animation: `pulse-dot 1.2s ${j * 0.2}s infinite` }} />
              ))}
            </div>
          ) : (
            <>
              <p style={{ fontSize: '15px', lineHeight: '2', color: '#d8c8f0', fontStyle: 'italic' }}>
                {prayer}
                {streaming && (
                  <span style={{ display: 'inline-block', width: '2px', height: '14px', background: ACCENT, marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 0.9s infinite' }} />
                )}
              </p>
              {!streaming && prayer && (
                <button
                  onClick={handleCopy}
                  style={{ marginTop: '1.5rem', fontSize: '12px', padding: '6px 16px', borderRadius: '8px', border: `1px solid ${ACCENT_BORDER}`, background: 'transparent', color: copied ? ACCENT : '#666', cursor: 'pointer', transition: 'color 0.15s' }}
                >
                  {copied ? '✓ Copied' : 'Copy prayer'}
                </button>
              )}
            </>
          )}
        </div>
      )}

    </div>
  )
}
