'use client'

import { useState, useEffect, useCallback } from 'react'
import { ROSTER, CATEGORY_STYLE, CATEGORY_ORDER, type Character, type Category } from './roster'
import BIOS from './bios.json'

type KeyMoment = { event: string; ref: string }
type KeyVerse = { ref: string; text: string }
type Bio = {
  name: string
  title: string
  era: string
  testament: string
  overview: string
  key_moments: KeyMoment[]
  significance: string
  key_verses: KeyVerse[]
  fun_fact: string
}

const FILTERS: Array<'All' | Category> = ['All', ...CATEGORY_ORDER]

// Pre-generated bios shipped with the app — zero runtime cost.
const STATIC_BIOS = BIOS as Record<string, Bio>

// Read a bio without hitting the API: static file first, then any the
// user has previously generated (cached in localStorage).
function readCachedBio(name: string): Bio | null {
  if (STATIC_BIOS[name]) return STATIC_BIOS[name]
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(`selah-bio:${name}`)
      if (stored) return JSON.parse(stored) as Bio
    } catch {
      /* ignore */
    }
  }
  return null
}

export default function CharactersPage() {
  const [filter, setFilter] = useState<'All' | Category>('All')
  const [selected, setSelected] = useState<Character | null>(null)

  const visible = filter === 'All' ? ROSTER : ROSTER.filter(c => c.category === filter)

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>
          Bible Characters
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>
          A collectible gallery of scripture&apos;s key figures. Tap any card for a full profile.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {FILTERS.map(f => {
          const active = filter === f
          const accent = f === 'All' ? '#aaa' : CATEGORY_STYLE[f].accent
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                border: `1px solid ${active ? (f === 'All' ? '#444' : CATEGORY_STYLE[f].border) : '#1e1e1e'}`,
                background: active ? (f === 'All' ? '#1a1a1a' : CATEGORY_STYLE[f].bg) : '#0d0d0d',
                color: active ? accent : '#666',
                fontSize: '12px',
                fontWeight: active ? '500' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Card wall */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
        gap: '12px',
      }}>
        {visible.map(c => (
          <TradingCard
            key={c.name}
            character={c}
            number={ROSTER.indexOf(c) + 1}
            onClick={() => setSelected(c)}
          />
        ))}
      </div>

      {selected && (
        <BioModal character={selected} onClose={() => setSelected(null)} />
      )}

    </div>
  )
}

function TradingCard({ character, number, onClick }: { character: Character; number: number; onClick: () => void }) {
  const s = CATEGORY_STYLE[character.category]
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: 0,
        cursor: 'pointer',
        borderRadius: '14px',
        border: `1px solid ${s.border}`,
        background: `linear-gradient(160deg, ${s.bg} 0%, #0a0a0a 60%)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 14px 36px ${s.accent}22`
        e.currentTarget.style.borderColor = s.accent
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = s.border
      }}
    >
      {/* Top strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 11px 0' }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: s.accent, fontWeight: '600', opacity: 0.85 }}>
          {character.category.toUpperCase()}
        </span>
        <span style={{ fontSize: '9px', color: '#444', fontFamily: 'var(--font-geist-mono)' }}>
          #{String(number).padStart(2, '0')}
        </span>
      </div>

      {/* Portrait */}
      <div style={{
        margin: '10px 11px 0',
        borderRadius: '10px',
        background: `radial-gradient(ellipse at center, ${s.accent}1f 0%, transparent 70%)`,
        border: `1px solid ${s.border}66`,
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <span style={{ fontSize: '40px', lineHeight: 1, filter: `drop-shadow(0 3px 8px ${s.accent}40)` }}>
          {character.emoji}
        </span>
      </div>

      {/* Nameplate */}
      <div style={{ padding: '10px 11px 11px' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#f0f0f0', lineHeight: '1.2', marginBottom: '2px' }}>
          {character.name}
        </p>
        <p style={{ fontSize: '10.5px', color: s.accent, opacity: 0.85, lineHeight: '1.3', marginBottom: '8px', minHeight: '26px' }}>
          {character.tagline}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '7px' }}>
          <span style={{ fontSize: '10px', color: '#555' }}>{character.era}</span>
          <span style={{
            fontSize: '9px',
            color: s.accent,
            border: `1px solid ${s.border}`,
            borderRadius: '4px',
            padding: '1px 5px',
            fontWeight: '600',
          }}>
            {character.testament}
          </span>
        </div>
      </div>
    </button>
  )
}

function BioModal({ character, onClose }: { character: Character; onClose: () => void }) {
  const s = CATEGORY_STYLE[character.category]
  const cached = readCachedBio(character.name)
  const [bio, setBio] = useState<Bio | null>(cached)
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a biblical scholar and biographer. Write accurate, engaging, non-denominational profiles grounded in the biblical text. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Write a profile of ${character.name} from the Bible (${character.category}, ${character.tagline}).

Respond with ONLY this JSON:
{
  "name": "${character.name}",
  "title": "a fitting epithet, e.g. 'The Shepherd King'",
  "era": "approximate time period",
  "testament": "Old Testament or New Testament",
  "overview": "who they were and why they matter (3-5 sentences)",
  "key_moments": [
    { "event": "a defining moment in their story, one sentence", "ref": "scripture reference" }
  ],
  "significance": "their theological and historical significance (3-5 sentences)",
  "key_verses": [
    { "ref": "scripture reference", "text": "the KJV verse text" }
  ],
  "fun_fact": "a memorable or lesser-known detail (1-2 sentences)"
}

Include 4-6 key moments and 2-3 key verses.`,
          }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed: Bio = JSON.parse(data.text)
      setBio(parsed)
      // Persist so this character is never generated again on this device.
      try {
        window.localStorage.setItem(`selah-bio:${character.name}`, JSON.stringify(parsed))
      } catch {
        /* storage full or unavailable — non-fatal */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [character])

  // Only generate when we have no cached/static bio.
  useEffect(() => {
    if (!bio) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  // Lock body scroll + Escape to close
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '86vh',
          overflowY: 'auto',
          background: '#0c0c0c',
          border: `1px solid ${s.border}`,
          borderRadius: '20px',
        }}
      >
        {/* Modal header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: `linear-gradient(160deg, ${s.bg} 0%, #0c0c0c 90%)`,
          borderBottom: '1px solid #161616',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            flexShrink: 0,
            borderRadius: '14px',
            background: `radial-gradient(ellipse at center, ${s.accent}26 0%, transparent 70%)`,
            border: `1px solid ${s.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
          }}>
            {character.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.14em', color: s.accent, fontWeight: '600', marginBottom: '3px' }}>
              {character.category.toUpperCase()}
            </p>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#f5f5f5', lineHeight: '1.15' }}>
              {character.name}
            </h2>
            <p style={{ fontSize: '12px', color: s.accent, opacity: 0.85, marginTop: '2px' }}>
              {bio?.title ?? character.tagline} · {character.era}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ flexShrink: 0, width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #252525', background: '#111', color: '#888', cursor: 'pointer', fontSize: '15px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>

          {error && (
            <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', marginBottom: '1rem' }}>
              {error}
              <button onClick={load} style={{ marginLeft: '10px', color: '#f87171', background: 'transparent', border: '1px solid #3f0f0f', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[100, 85, 92, 70].map((w, i) => (
                <div key={i} style={{ height: '13px', width: `${w}%`, background: '#161616', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.12}s ease-in-out infinite` }} />
              ))}
              <div style={{ height: '60px', background: '#0e0e0e', border: '1px solid #1a1a1a', borderRadius: '10px', marginTop: '6px', animation: 'shimmer 1.6s 0.3s ease-in-out infinite' }} />
            </div>
          )}

          {bio && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Overview */}
              <p style={{ fontSize: '14px', color: '#cfcfcf', lineHeight: '1.85' }}>{bio.overview}</p>

              {/* Key moments */}
              <div>
                <p style={{ fontSize: '10px', color: s.accent, letterSpacing: '0.12em', marginBottom: '0.85rem', opacity: 0.8 }}>CAREER HIGHLIGHTS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {bio.key_moments.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{
                        flexShrink: 0,
                        width: '20px', height: '20px',
                        borderRadius: '6px',
                        background: s.bg,
                        border: `1px solid ${s.border}`,
                        color: s.accent,
                        fontSize: '10px',
                        fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: '1px',
                      }}>{i + 1}</span>
                      <span style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.6' }}>
                        {m.event} <span style={{ color: s.accent, opacity: 0.8, fontSize: '12px' }}>({m.ref})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Significance */}
              <div>
                <p style={{ fontSize: '10px', color: s.accent, letterSpacing: '0.12em', marginBottom: '0.6rem', opacity: 0.8 }}>SIGNIFICANCE</p>
                <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.85' }}>{bio.significance}</p>
              </div>

              {/* Key verses */}
              <div>
                <p style={{ fontSize: '10px', color: s.accent, letterSpacing: '0.12em', marginBottom: '0.85rem', opacity: 0.8 }}>KEY VERSES</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {bio.key_verses.map((v, i) => (
                    <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                      <p style={{ fontSize: '11px', color: s.accent, fontWeight: '500', marginBottom: '4px' }}>{v.ref}</p>
                      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.7', fontStyle: 'italic' }}>&ldquo;{v.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun fact */}
              <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '1rem 1.25rem' }}>
                <p style={{ fontSize: '10px', color: s.accent, letterSpacing: '0.12em', marginBottom: '0.5rem', opacity: 0.9 }}>DID YOU KNOW?</p>
                <p style={{ fontSize: '13px', color: '#cfcfcf', lineHeight: '1.75' }}>{bio.fun_fact}</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
