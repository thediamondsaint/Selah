'use client'

import { useState } from 'react'
import { useProfile } from './ProfileContext'
import { newPrayerRequest, type ReadingLevel } from './profile'

const ACCENT = '#818cf8'
const ACCENT_BG = '#1e1b4b'
const ACCENT_BORDER = '#312e81'

const LEVELS: Array<{ id: ReadingLevel; label: string }> = [
  { id: '', label: 'Default' },
  { id: 'child', label: 'Child' },
  { id: 'teen', label: 'Teen' },
  { id: 'adult', label: 'Adult' },
  { id: 'simple', label: 'Simple' },
]

const TRANSLATIONS = ['', 'KJV', 'NKJV', 'ESV', 'NIV', 'NASB', 'NLT', 'CSB', 'MSG', 'AMP']

const TRADITIONS = [
  'Non-denominational', 'Catholic', 'Orthodox', 'Baptist', 'Methodist',
  'Lutheran', 'Presbyterian', 'Pentecostal', 'Anglican', 'Reformed',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: '10px',
  border: '1px solid #252525',
  background: '#111',
  color: '#f0f0f0',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s',
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#666', marginBottom: '2px' }}>{label}</p>
      {hint && <p style={{ fontSize: '12px', color: '#555', marginBottom: '0.7rem' }}>{hint}</p>}
      {!hint && <div style={{ height: '0.7rem' }} />}
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { profile, update, reset, loaded } = useProfile()
  const [prayerDraft, setPrayerDraft] = useState('')

  function addPrayer() {
    const text = prayerDraft.trim()
    if (!text) return
    update({ prayerRequests: [...profile.prayerRequests, newPrayerRequest(text)] })
    setPrayerDraft('')
  }

  function toggleAnswered(id: string) {
    update({
      prayerRequests: profile.prayerRequests.map(r =>
        r.id === id ? { ...r, answered: !r.answered } : r
      ),
    })
  }

  function removePrayer(id: string) {
    update({ prayerRequests: profile.prayerRequests.filter(r => r.id !== id) })
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '999px',
          background: profile.name.trim() ? 'linear-gradient(140deg, #a5b4fc, #6366f1)' : '#161616',
          border: profile.name.trim() ? 'none' : '1px solid #252525',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: profile.name.trim() ? '20px' : '22px', fontWeight: '600', color: '#0b0b14', flexShrink: 0,
        }}>
          {loaded && profile.name.trim() ? profile.name.trim()[0].toUpperCase() : '👤'}
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0' }}>
            {profile.name.trim() ? `Hello, ${profile.name.trim().split(/\s+/)[0]}` : 'Your Profile'}
          </h1>
          <p style={{ fontSize: '13px', color: '#555' }}>
            Selah will use this to personalize your study. Stored on this device only.
          </p>
        </div>
      </div>

      <div style={{ height: '1px', background: '#161616', margin: '1.75rem 0' }} />

      {/* Name */}
      <Field label="NAME" hint="How Selah should address you.">
        <input
          type="text"
          value={profile.name}
          onChange={e => update({ name: e.target.value })}
          placeholder="Your name"
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
      </Field>

      {/* Reading level */}
      <Field label="READING LEVEL" hint="The default reading level for explanations and rewrites.">
        <div style={{ display: 'flex', gap: '4px', background: '#111', padding: '4px', borderRadius: '10px', border: '1px solid #1e1e1e' }}>
          {LEVELS.map(l => (
            <button
              key={l.id || 'default'}
              onClick={() => update({ readingLevel: l.id })}
              style={{
                flex: 1, padding: '7px 0', borderRadius: '7px', border: 'none',
                background: profile.readingLevel === l.id ? ACCENT_BG : 'transparent',
                color: profile.readingLevel === l.id ? ACCENT : '#555',
                fontSize: '12px', fontWeight: profile.readingLevel === l.id ? '500' : '400',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Translation */}
      <Field label="PREFERRED TRANSLATION" hint="Which translation Selah should lean on when quoting scripture.">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TRANSLATIONS.map(t => {
            const active = profile.translation === t
            return (
              <button
                key={t || 'none'}
                onClick={() => update({ translation: t })}
                style={{
                  padding: '5px 14px', borderRadius: '999px',
                  border: `1px solid ${active ? ACCENT_BORDER : '#1e1e1e'}`,
                  background: active ? ACCENT_BG : '#0d0d0d',
                  color: active ? ACCENT : '#666',
                  fontSize: '12px', fontWeight: active ? '500' : '400', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {t || 'No preference'}
              </button>
            )
          })}
        </div>
      </Field>

      {/* Tradition */}
      <Field label="FAITH TRADITION" hint="Optional — helps Selah be considerate of your background.">
        <input
          type="text"
          value={profile.tradition}
          onChange={e => update({ tradition: e.target.value })}
          placeholder="e.g. Non-denominational, Catholic, Baptist…"
          style={{ ...inputStyle, marginBottom: '0.7rem' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TRADITIONS.map(t => (
            <button
              key={t}
              onClick={() => update({ tradition: t })}
              style={{
                padding: '4px 12px', borderRadius: '999px',
                border: `1px solid ${profile.tradition === t ? ACCENT_BORDER : '#1e1e1e'}`,
                background: profile.tradition === t ? ACCENT_BG : '#0d0d0d',
                color: profile.tradition === t ? ACCENT : '#666',
                fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {/* Prayer requests */}
      <Field label="PRAYER REQUESTS" hint="Selah can weave these into prayers and devotionals.">
        <div style={{ display: 'flex', gap: '8px', marginBottom: profile.prayerRequests.length ? '0.85rem' : 0 }}>
          <input
            type="text"
            value={prayerDraft}
            onChange={e => setPrayerDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPrayer()}
            placeholder="Add a prayer request…"
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
          />
          <button
            onClick={addPrayer}
            disabled={!prayerDraft.trim()}
            style={{
              padding: '11px 18px', borderRadius: '10px', background: ACCENT, color: '#09090f',
              fontWeight: '600', border: 'none', fontSize: '14px',
              cursor: prayerDraft.trim() ? 'pointer' : 'not-allowed', opacity: prayerDraft.trim() ? 1 : 0.45,
              whiteSpace: 'nowrap',
            }}
          >
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {profile.prayerRequests.map(r => (
            <div
              key={r.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '10px',
                background: '#0d0d0d', border: '1px solid #1a1a1a',
              }}
            >
              <button
                onClick={() => toggleAnswered(r.id)}
                aria-label={r.answered ? 'Mark unanswered' : 'Mark answered'}
                style={{
                  width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0, cursor: 'pointer',
                  border: `1px solid ${r.answered ? '#14532d' : '#333'}`,
                  background: r.answered ? '#052e16' : 'transparent',
                  color: '#4ade80', fontSize: '11px', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {r.answered ? '✓' : ''}
              </button>
              <span style={{
                flex: 1, fontSize: '13px', lineHeight: '1.5',
                color: r.answered ? '#555' : '#ccc',
                textDecoration: r.answered ? 'line-through' : 'none',
              }}>
                {r.text}
              </span>
              {r.answered && (
                <span style={{ fontSize: '10px', color: '#4ade80', opacity: 0.7, letterSpacing: '0.06em' }}>ANSWERED</span>
              )}
              <button
                onClick={() => removePrayer(r.id)}
                aria-label="Delete"
                style={{ color: '#444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', flexShrink: 0, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Field>

      {/* Notes */}
      <Field label="PERSONAL NOTES" hint="Anything you'd like Selah to keep in mind — your season of life, questions, struggles.">
        <textarea
          value={profile.notes}
          onChange={e => update({ notes: e.target.value })}
          placeholder="e.g. New to faith and reading through the Gospels for the first time…"
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
      </Field>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #161616' }}>
        <span style={{ fontSize: '12px', color: '#444' }}>✓ Saved automatically on this device</span>
        <button
          onClick={() => { if (confirm('Clear your entire profile? This cannot be undone.')) reset() }}
          style={{ fontSize: '12px', color: '#666', background: 'transparent', border: '1px solid #252525', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer' }}
        >
          Clear profile
        </button>
      </div>

    </div>
  )
}
