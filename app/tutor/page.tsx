'use client'

import { useState, useRef, useEffect } from 'react'
import { useProfile } from '../profile/ProfileContext'
import { buildPersona } from '../profile/profile'

const MODES = [
  { id: 'general', label: 'General' },
  { id: 'history', label: 'Historical' },
  { id: 'theology', label: 'Theology' },
  { id: 'apply', label: 'Application' },
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
  'Explain the Trinity',
  'What is grace?',
]

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Message = {
  role: 'assistant',
  content: "Welcome — ask me anything about the Bible. A verse, a story, a theological question, or something you've always wondered about.",
}

export default function TutorPage() {
  const { profile } = useProfile()
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('general')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const q = (text ?? input).trim()
    if (!q || loading || streaming) return
    setInput('')

    const userMsg: Message = { role: 'user', content: q }
    const withUser = [...messages, userMsg]
    // add empty assistant placeholder
    setMessages([...withUser, { role: 'assistant', content: '' }])
    setLoading(true)

    // Skip the hardcoded welcome — it wasn't produced by the model in context
    const apiMessages = withUser
      .slice(1)
      .slice(-20) // keep last ~10 turns for context
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are an AI Bible Tutor — knowledgeable, warm, non-denominational, and accessible. ${MODE_PROMPTS[mode]} Keep answers to 3–5 sentences unless more depth is clearly needed. Reference related scriptures briefly when helpful. Never be preachy.${buildPersona(profile)}`,
          messages: apiMessages,
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
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        }
        return updated
      })
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  const isOnlyWelcome = messages.length === 1

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: '2rem 1.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 52px)',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '3px' }}>
          Bible Tutor
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Ask anything about scripture — history, meaning, theology, or life application.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '1.5rem',
        background: '#111',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #1e1e1e',
      }}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: '7px',
              border: 'none',
              background: mode === m.id ? '#1e1b4b' : 'transparent',
              color: mode === m.id ? '#818cf8' : '#555',
              fontSize: '12px',
              fontWeight: mode === m.id ? '500' : '400',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1
          const showDots = m.role === 'assistant' && m.content === '' && loading
          const showCursor = m.role === 'assistant' && isLast && streaming && m.content !== ''

          if (m.role === 'user') {
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: '16px 16px 4px 16px',
                  fontSize: '14px',
                  lineHeight: '1.65',
                  background: '#1e1b4b',
                  color: '#c7d2fe',
                  border: '1px solid #312e81',
                }}>
                  {m.content}
                </div>
              </div>
            )
          }

          return (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#111',
                border: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                📖
              </div>
              <div style={{
                maxWidth: '84%',
                padding: '10px 14px',
                borderRadius: '4px 16px 16px 16px',
                fontSize: '14px',
                lineHeight: '1.8',
                background: '#111',
                color: '#ddd',
                border: '1px solid #1e1e1e',
              }}>
                {showDots ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '3px 0' }}>
                    {[0, 1, 2].map(j => (
                      <div
                        key={j}
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: '#444',
                          animation: `pulse-dot 1.2s ${j * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    {m.content}
                    {showCursor && (
                      <span style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '13px',
                        background: '#818cf8',
                        marginLeft: '2px',
                        verticalAlign: 'text-bottom',
                        animation: 'blink 0.9s infinite',
                      }} />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — only on first load */}
      {isOnlyWelcome && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: '1px solid #1e1e1e',
                background: '#111',
                color: '#666',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#333'
                e.currentTarget.style.color = '#999'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e1e'
                e.currentTarget.style.color = '#666'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask anything about the Bible…"
          disabled={loading || streaming}
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
          onClick={() => sendMessage()}
          disabled={loading || streaming || !input.trim()}
          style={{
            padding: '11px 22px',
            borderRadius: '10px',
            background: '#818cf8',
            color: '#09090f',
            fontWeight: '600',
            border: 'none',
            cursor: (loading || streaming || !input.trim()) ? 'not-allowed' : 'pointer',
            opacity: (loading || streaming || !input.trim()) ? 0.45 : 1,
            fontSize: '14px',
            transition: 'opacity 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Ask
        </button>
      </div>

    </div>
  )
}
