'use client'

import { useState } from 'react'

const TOPIC_PRESETS = [
  'Life of Jesus', 'The Psalms', "Paul's Letters",
  'The Prophets', 'Wisdom Literature', 'Acts of the Apostles',
  'Book of Revelation', 'New Testament Overview',
]

const DURATIONS = [
  { id: '1w', label: '1 Week' },
  { id: '2w', label: '2 Weeks' },
  { id: '1m', label: '1 Month' },
  { id: '3m', label: '3 Months' },
]

const PACES = [
  { id: 'light', label: 'Light', sub: '~5 min' },
  { id: 'medium', label: 'Medium', sub: '~15 min' },
  { id: 'deep', label: 'Deep', sub: '~30 min' },
]

type Day = { day: string; title: string; passages: string[]; note: string }
type Section = { label: string; theme: string; days: Day[] }
type Plan = { title: string; description: string; sections: Section[] }

const ACCENT = '#f59e0b'
const ACCENT_BG = '#1c1200'
const ACCENT_BORDER = '#78350f'

export default function PlansPage() {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('2w')
  const [pace, setPace] = useState('medium')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openSection, setOpenSection] = useState(0)

  async function generate() {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setPlan(null)

    const durationLabel = DURATIONS.find(d => d.id === duration)?.label ?? ''
    const paceLabel = PACES.find(p => p.id === pace)?.label ?? ''

    const structure =
      duration === '1w' ? 'One section labeled "This Week" with 7 days' :
      duration === '2w' ? 'Two sections: "Week 1" and "Week 2", 7 days each' :
      duration === '1m' ? 'Four sections: "Week 1" through "Week 4", 7 days each' :
      'Twelve sections: "Week 1" through "Week 12", 3–4 highlight days per week'

    const passagesPerDay =
      pace === 'light' ? '1–2 short passages (2–5 verses each)' :
      pace === 'medium' ? '2–3 passages (5–15 verses each)' :
      '3–4 passages (full chapters when appropriate)'

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'You are a Bible scholar and spiritual director. Respond with valid JSON only — no markdown, no extra text.',
          messages: [{
            role: 'user',
            content: `Create a personalized Bible reading plan.
Topic/Goal: "${topic}"
Duration: ${durationLabel}
Pace: ${paceLabel} (${passagesPerDay})
Structure: ${structure}

Respond with ONLY this JSON:
{
  "title": "short plan title",
  "description": "1–2 sentence overview of what the reader will gain",
  "sections": [
    {
      "label": "Week 1",
      "theme": "section theme in 3–5 words",
      "days": [
        {
          "day": "Day 1",
          "title": "short day title",
          "passages": ["Matthew 1:1-17"],
          "note": "one sentence of focus or insight for this day"
        }
      ]
    }
  ]
}`,
          }],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      const parsed: Plan = JSON.parse(data.text)
      setPlan(parsed)
      setOpenSection(0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>Reading Plans</h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Personalized plans built around your goals and schedule.</p>
      </div>

      {/* Topic */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.6rem' }}>WHAT DO YOU WANT TO STUDY?</p>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="e.g. Life of Jesus, the Psalms, Paul's letters…"
          style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1px solid #252525', background: '#111', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.15s' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#333' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#252525' }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.6rem' }}>
          {TOPIC_PRESETS.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              style={{ padding: '4px 12px', borderRadius: '999px', border: `1px solid ${topic === t ? ACCENT_BORDER : '#1e1e1e'}`, background: topic === t ? ACCENT_BG : '#0d0d0d', color: topic === t ? ACCENT : '#666', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Duration + Pace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.5rem' }}>DURATION</p>
          <div style={{ display: 'flex', gap: '3px', background: '#111', padding: '4px', borderRadius: '10px', border: '1px solid #1e1e1e' }}>
            {DURATIONS.map(d => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                style={{ flex: 1, padding: '6px 0', borderRadius: '7px', border: 'none', background: duration === d.id ? ACCENT_BG : 'transparent', color: duration === d.id ? ACCENT : '#555', fontSize: '11px', fontWeight: duration === d.id ? '500' : '400', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#444', marginBottom: '0.5rem' }}>DAILY PACE</p>
          <div style={{ display: 'flex', gap: '3px', background: '#111', padding: '4px', borderRadius: '10px', border: '1px solid #1e1e1e' }}>
            {PACES.map(p => (
              <button
                key={p.id}
                onClick={() => setPace(p.id)}
                style={{ flex: 1, padding: '6px 0', borderRadius: '7px', border: 'none', background: pace === p.id ? ACCENT_BG : 'transparent', color: pace === p.id ? ACCENT : '#555', cursor: 'pointer', transition: 'all 0.15s', lineHeight: '1.2' }}
              >
                <div style={{ fontSize: '11px', fontWeight: pace === p.id ? '500' : '400' }}>{p.label}</div>
                <div style={{ fontSize: '10px', opacity: 0.55 }}>{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !topic.trim()}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: ACCENT, color: '#1a0a00', fontWeight: '600', border: 'none', cursor: (loading || !topic.trim()) ? 'not-allowed' : 'pointer', opacity: (loading || !topic.trim()) ? 0.45 : 1, fontSize: '14px', marginBottom: '2rem', transition: 'opacity 0.15s' }}
      >
        {loading ? 'Generating your plan…' : 'Generate Plan'}
      </button>

      {error && (
        <div style={{ color: '#f87171', background: '#180808', border: '1px solid #3f0f0f', borderRadius: '10px', padding: '10px 16px', marginBottom: '1.5rem', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '11px', width: '30%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.1}s ease-in-out infinite` }} />
              <div style={{ height: '13px', width: '60%', background: '#1a1a1a', borderRadius: '4px', animation: `shimmer 1.6s ${i * 0.1 + 0.1}s ease-in-out infinite` }} />
            </div>
          ))}
        </div>
      )}

      {plan && !loading && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '5px' }}>{plan.title}</h2>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.65' }}>{plan.description}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {plan.sections.map((section, si) => (
              <div
                key={si}
                style={{ background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden' }}
              >
                <button
                  onClick={() => setOpenSection(openSection === si ? -1 : si)}
                  style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div>
                    <span style={{ fontSize: '10px', color: ACCENT, letterSpacing: '0.12em', opacity: 0.75 }}>
                      {section.label.toUpperCase()}
                    </span>
                    <p style={{ fontSize: '14px', color: '#ccc', fontWeight: '500', marginTop: '2px' }}>
                      {section.theme}
                    </p>
                  </div>
                  <span style={{ color: '#444', fontSize: '18px', fontWeight: '300', flexShrink: 0 }}>
                    {openSection === si ? '−' : '+'}
                  </span>
                </button>

                {openSection === si && (
                  <div style={{ borderTop: '1px solid #161616' }}>
                    {section.days.map((day, di) => (
                      <div
                        key={di}
                        style={{ padding: '0.9rem 1.25rem', borderBottom: di < section.days.length - 1 ? '1px solid #141414' : 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                      >
                        <div style={{ flexShrink: 0, paddingTop: '1px' }}>
                          <p style={{ fontSize: '10px', color: '#3a3a3a', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                            {day.day.toUpperCase()}
                          </p>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: '#ddd', marginBottom: '5px' }}>{day.title}</p>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '5px' }}>
                            {day.passages.map((p, pi) => (
                              <span
                                key={pi}
                                style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '5px', background: '#161616', border: '1px solid #222', color: ACCENT }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.55' }}>{day.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
