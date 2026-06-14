'use client'

import { useState } from 'react'

const NT_PRESETS = ['John 1:1', 'John 3:16', 'Romans 8:28', 'Philippians 4:13', 'Ephesians 2:8-9']
const OT_PRESETS = ['Genesis 1:1', 'Psalm 23:1', 'Isaiah 53:5', 'Deuteronomy 6:4', 'Proverbs 3:5-6']

type Word = {
  original: string
  transliteration: string
  strongs: string
  gloss: string
  parsing: string
  notes: string
}

type InterlinearResult = {
  testament: 'NT' | 'OT'
  language: 'Greek' | 'Hebrew'
  verse_ref: string
  original_text: string
  kjv: string
  words: Word[]
}

const ACCENT = '#f97316'
const ACCENT_BG = '#1a0a00'
const ACCENT_BORDER = '#9a3412'

function WordCard({ word, rtl }: { word: Word; rtl: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: '84px',
        padding: '12px 10px',
        background: '#0d0d0d',
        border: `1px solid ${hovered ? ACCENT_BORDER : '#1e1e1e'}`,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        transition: 'border-color 0.15s',
        cursor: 'default',
      }}
    >
      {/* Original script */}
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        style={{
          fontSize: '18px',
          color: '#f0f0f0',
          lineHeight: '1.4',
          textAlign: rtl ? 'right' : 'left',
          fontFamily: rtl ? 'Georgia, "Times New Roman", serif' : 'inherit',
          marginBottom: '3px',
          letterSpacing: rtl ? '0.02em' : 'normal',
        }}
      >
        {word.original}
      </div>

      {/* Transliteration */}
      <div style={{ fontSize: '11px', color: '#777', fontStyle: 'italic', lineHeight: '1.3' }}>
        {word.transliteration}
      </div>

      <div style={{ height: '1px', background: '#1e1e1e', margin: '4px 0' }} />

      {/* Strong's */}
      <div style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.05em', fontFamily: 'var(--font-geist-mono)' }}>
        {word.strongs}
      </div>

      {/* Gloss */}
      <div style={{ fontSize: '12px', fontWeight: '500', color: '#e0e0e0', lineHeight: '1.35' }}>
        {word.gloss}
      </div>

      {/* Parsing */}
      <div style={{
        fontSize: '10px',
        color: '#444',
        fontFamily: 'var(--font-geist-mono)',
        marginTop: '2px',
        lineHeight: '1.3',
      }}>
        {word.parsing}
      </div>

      {/* Notes */}
      {word.notes && (
        <div style={{ fontSize: '10px', color: '#555', marginTop: '3px', lineHeight: '1.4', fontStyle: 'italic', borderTop: '1px solid #1a1a1a', paddingTop: '4px' }}>
          {word.notes}
        </div>
      )}
    </div>
  )
}

const NT_KEY = [
  { label: 'Parts of Speech', value: 'V = Verb · N = Noun · ADJ = Adjective · ADV = Adverb · PRON = Pronoun · ART = Article · PREP = Preposition · CONJ = Conjunction · PART = Particle' },
  { label: 'Tense', value: 'P = Present · I = Imperfect · F = Future · A = Aorist · X = Perfect · Y = Pluperfect' },
  { label: 'Voice', value: 'A = Active · M = Middle · P = Passive' },
  { label: 'Mood', value: 'I = Indicative · S = Subjunctive · O = Optative · M = Imperative · N = Infinitive · P = Participle' },
  { label: 'Case', value: 'N = Nominative · G = Genitive · D = Dative · A = Accusative · V = Vocative' },
  { label: 'Number/Gender', value: 'S = Singular · P = Plural · M = Masculine · F = Feminine · N = Neuter' },
]

const OT_KEY = [
  { label: 'Parts of Speech', value: 'V = Verb · N = Noun · ADJ = Adjective · ADV = Adverb · PREP = Preposition · CONJ = Conjunction · PART = Particle · PRN = Pronoun' },
  { label: 'Verb Stems', value: 'Qal · Niphal · Piel · Pual · Hiphil · Hophal · Hithpael' },
  { label: 'Conjugation', value: 'Perf = Perfect · Imperf = Imperfect · Imper = Imperative · Inf = Infinitive · Part = Participle' },
  { label: 'Gender / Number', value: 'm = masculine · f = feminine · c = common · s = singular · p = plural · d = dual' },
  { label: 'Person', value: '1 = first · 2 = second · 3 = third' },
]

export default function InterlinearPage() {
  const [ref, setRef] = useState('')
  const [result, setResult] = useState<InterlinearResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)

  const isHebrew = result?.testament === 'OT'

  async function lookup(verseRef: string) {
    if (loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a biblical language scholar with expertise in Koine Greek (NT) and Biblical Hebrew (OT). Provide accurate word-by-word interlinear analysis with correct Strong\'s concordance numbers, standard parsing abbreviations, and proper transliterations. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Provide a complete word-by-word interlinear analysis for: "${verseRef}"

Determine OT (Hebrew) or NT (Greek) from the book name.

For OT: list words in right-to-left reading order — index 0 = the first Hebrew word (which appears on the right side of the line).
For NT: list words left to right as they appear in the Greek text.

Include every word, including articles, prepositions, and conjunctions — do not skip any.

Respond with ONLY this JSON shape:
{
  "testament": "NT",
  "language": "Greek",
  "verse_ref": "John 3:16",
  "original_text": "complete verse in original script",
  "kjv": "complete KJV translation",
  "words": [
    {
      "original": "word in original script",
      "transliteration": "romanized pronunciation using standard academic notation",
      "strongs": "G#### or H####",
      "gloss": "primary meaning in 1–3 English words",
      "parsing": "abbreviated morphological analysis e.g. V-AAI-3S or N-GMS or ADV",
      "notes": "optional brief note on theological or grammatical significance, or empty string"
    }
  ]
}`,
          }],
        }),
      })

      const data = await res.json()
      const parsed: InterlinearResult = JSON.parse(data.text)
      setResult(parsed)
      setRef(parsed.verse_ref)
    } catch {
      setError('Something went wrong. Please check the reference and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleGo() {
    if (ref.trim() && !loading) lookup(ref.trim())
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>
          Interlinear
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Word-by-word Greek and Hebrew with transliteration, Strong's numbers, and grammatical parsing.
        </p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={ref}
          onChange={e => setRef(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Enter a verse — e.g. John 3:16 or Genesis 1:1"
          style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <button
          onClick={handleGo}
          disabled={loading || !ref.trim()}
          style={{ padding: '11px 24px', borderRadius: '10px', background: ACCENT, color: '#1a0800', fontWeight: '600', border: 'none', cursor: (loading || !ref.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !ref.trim()) ? 0.45 : 1, fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
        >
          {loading ? 'Loading…' : 'Look up'}
        </button>
      </div>

      {/* Preset groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3a3a3a', flexShrink: 0 }}>GREEK</span>
          {NT_PRESETS.map(p => (
            <button key={p} onClick={() => { setRef(p); lookup(p) }}
              style={{ padding: '3px 11px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}>
              {p}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#3a3a3a', flexShrink: 0 }}>HEBREW</span>
          {OT_PRESETS.map(p => (
            <button key={p} onClick={() => { setRef(p); lookup(p) }}
              style={{ padding: '3px 11px', borderRadius: '999px', border: '1px solid #1e1e1e', background: '#0d0d0d', color: '#666', fontSize: '12px', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.color = '#888' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div>
          {/* Skeleton header */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ height: '22px', width: '120px', background: '#161616', borderRadius: '6px', animation: 'shimmer 1.6s ease-in-out infinite' }} />
            <div style={{ height: '22px', width: '140px', background: '#161616', borderRadius: '999px', animation: 'shimmer 1.6s 0.1s ease-in-out infinite' }} />
          </div>
          {/* Skeleton KJV block */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '10px', width: '30px', background: '#1a1a1a', borderRadius: '3px', animation: 'shimmer 1.6s ease-in-out infinite' }} />
            <div style={{ height: '14px', width: '90%', background: '#1a1a1a', borderRadius: '4px', animation: 'shimmer 1.6s 0.05s ease-in-out infinite' }} />
            <div style={{ height: '14px', width: '70%', background: '#1a1a1a', borderRadius: '4px', animation: 'shimmer 1.6s 0.1s ease-in-out infinite' }} />
          </div>
          {/* Skeleton original text */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ height: '10px', width: '50px', background: '#1a1a1a', borderRadius: '3px', animation: 'shimmer 1.6s ease-in-out infinite' }} />
            <div style={{ height: '18px', width: '80%', background: '#1a1a1a', borderRadius: '4px', animation: 'shimmer 1.6s 0.05s ease-in-out infinite' }} />
          </div>
          {/* Skeleton word cards */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[96, 84, 112, 90, 100, 88, 104, 86, 94, 108, 82, 98].map((w, i) => (
              <div key={i} style={{ width: `${w}px`, height: '128px', background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '10px', animation: `shimmer 1.6s ${i * 0.06}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div>

          {/* Verse ref + language badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f0f0f0' }}>{result.verse_ref}</h2>
            <span style={{ fontSize: '11px', padding: '3px 12px', borderRadius: '999px', background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, letterSpacing: '0.08em' }}>
              {result.language} · {result.testament === 'NT' ? 'New Testament' : 'Old Testament'}
            </span>
          </div>

          {/* KJV */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>KING JAMES VERSION</p>
            <p style={{ fontSize: '14px', lineHeight: '1.85', color: '#999', fontStyle: 'italic' }}>{result.kjv}</p>
          </div>

          {/* Original text */}
          <div style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
              {result.language.toUpperCase()} ORIGINAL
              {isHebrew && <span style={{ color: '#2e2e2e', marginLeft: '8px' }}>reads right → left</span>}
            </p>
            <p
              dir={isHebrew ? 'rtl' : 'ltr'}
              style={{
                fontSize: '20px',
                lineHeight: '1.7',
                color: '#d0d0d0',
                textAlign: isHebrew ? 'right' : 'left',
                fontFamily: isHebrew ? 'Georgia, "Times New Roman", serif' : 'inherit',
                letterSpacing: isHebrew ? '0.03em' : 'normal',
              }}
            >
              {result.original_text}
            </p>
          </div>

          {/* Direction hint for Hebrew */}
          {isHebrew && (
            <p style={{ fontSize: '11px', color: '#3a3a3a', marginBottom: '0.75rem', textAlign: 'right' }}>
              ← cards flow right to left, matching Hebrew reading order
            </p>
          )}

          {/* Word cards */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              direction: isHebrew ? 'rtl' : 'ltr',
              marginBottom: '1.5rem',
            }}
          >
            {result.words.map((word, i) => (
              <WordCard key={i} word={word} rtl={isHebrew} />
            ))}
          </div>

          {/* Parsing key (collapsible) */}
          <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '12px', overflow: 'hidden' }}>
            <button
              onClick={() => setShowKey(v => !v)}
              style={{ width: '100%', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '10px', color: '#444', letterSpacing: '0.12em' }}>PARSING KEY</span>
              <span style={{ fontSize: '14px', color: '#333' }}>{showKey ? '−' : '+'}</span>
            </button>
            {showKey && (
              <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #161616' }}>
                {(isHebrew ? OT_KEY : NT_KEY).map(({ label, value }) => (
                  <div key={label} style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '10px', color: '#555', fontWeight: '500', marginBottom: '3px' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.7', fontFamily: 'var(--font-geist-mono)' }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
