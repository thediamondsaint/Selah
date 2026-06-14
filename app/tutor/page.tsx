'use client'

import { useState, useRef, useEffect } from 'react'

const MODES = [
  { id: 'general', label: 'General study' },
  { id: 'history', label: 'Historical context' },
  { id: 'theology', label: 'Theology' },
  { id: 'apply', label: 'Life application' },
]

const MODE_PROMPTS: Record<string, string> = {
  general: 'Answer as a knowledgeable, warm, and accessible Bible study teacher.',
  history: 'Focus on historical, cultural, and archaeological context. Include authorship, date, audience, and ancient Near Eastern or Greco-Roman background.',
  theology: 'Focus on theological meaning — doctrinal significance, systematic theology, and key denominational perspectives.',
  apply: 'Focus on practical life application — how this passage applies to everyday modern life, challenges, relationships, and faith.',
}

const SUGGESTIONS = [
  'What does John 3:16 really mean?',
  'Who wrote the Psalms?',
  'What is the Sermon on the Mount about?',
  'Why did God allow suffering in Job?',
  'What does faith mean in Hebrews 11?',
  'Explain the Trinity',
]

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome! Ask me anything about the Bible — a verse, a story, a theological question, or something you\'ve always wondered about.' }
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('general')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string) {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are an AI Bible Tutor — knowledgeable, warm, non-denominational, and accessible. ${MODE_PROMPTS[mode]} Keep answers to 3–5 sentences unless more depth is clearly needed. Reference related scriptures briefly when helpful. Never be preachy.`,
          prompt: newMessages
            .filter(m => m.role === 'user')
            .slice(-6)
            .map(m => m.content)
            .join('\n\nUser: '),
        }),
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col" style={{ minHeight: '100vh' }}>
      <a href="/" style={{ color: '#888', fontSize: '14px' }}>← Back</a>

      <h1 style={{ fontSize: '2rem', fontWeight: '600', margin: '1.5rem 0 0.5rem' }}>Bible Tutor</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Ask anything about scripture.</p>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{ padding: '5px 14px', borderRadius: '999px', border: `1px solid ${mode === m.id ? '#818cf8' : '#333'}`, background: mode === m.id ? '#1e1b4b' : 'transparent', color: mode === m.id ? '#818cf8' : '#888', fontSize: '13px', cursor: 'pointer' }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem', minHeight: '300px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              lineHeight: '1.7',
              background: m.role === 'user' ? '#1e1b4b' : '#1a1a1a',
              color: m.role === 'user' ? '#c7d2fe' : '#e5e5e5',
              border: `1px solid ${m.role === 'user' ? '#312e81' : '#2a2a2a'}`,
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '10px 16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#555', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            style={{ padding: '4px 12px', borderRadius: '999px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#888', fontSize: '12px', cursor: 'pointer' }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about the Bible…"
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: '#f0f0f0', fontSize: '15px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{ padding: '10px 20px', borderRadius: '8px', background: '#818cf8', color: '#000', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          Ask
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </main>
  )
}