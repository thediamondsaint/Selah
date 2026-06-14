'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Logo } from './Logo'
import { FEATURES, CATEGORIES } from '../features'
import { useProfile } from '../profile/ProfileContext'
import { firstName } from '../profile/profile'

export function Header() {
  const pathname = usePathname()
  const { profile, loaded } = useProfile()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fname = firstName(profile)
  const onProfile = pathname === '/profile'

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const active = FEATURES.find(f => f.href === pathname)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      borderBottom: '1px solid #161616',
      background: 'rgba(8,8,8,0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {/* Wordmark */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Logo size={26} />
        <span style={{
          fontSize: '17px',
          fontWeight: '600',
          letterSpacing: '0.01em',
          color: '#f0f0f0',
        }}>
          Selah
        </span>
      </Link>

      {/* Right side: profile chip + features menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

      {/* Profile chip */}
      <Link
        href="/profile"
        aria-label="Your profile"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: fname ? '5px 12px 5px 5px' : '7px 12px',
          borderRadius: '999px',
          border: `1px solid ${onProfile ? '#312e81' : '#1e1e1e'}`,
          background: onProfile ? '#1e1b4b' : '#0e0e0e',
          transition: 'all 0.15s',
        }}
      >
        <span style={{
          width: '22px',
          height: '22px',
          borderRadius: '999px',
          background: fname ? 'linear-gradient(140deg, #a5b4fc, #6366f1)' : '#1a1a1a',
          border: fname ? 'none' : '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fname ? '11px' : '12px',
          fontWeight: '600',
          color: fname ? '#0b0b14' : '#666',
          flexShrink: 0,
        }}>
          {/* Render initial only once hydrated to avoid mismatch */}
          {loaded && fname ? fname[0].toUpperCase() : '👤'}
        </span>
        {loaded && fname && (
          <span style={{ fontSize: '13px', color: onProfile ? '#c7d2fe' : '#bbb', fontWeight: '500' }}>
            {fname}
          </span>
        )}
      </Link>

      {/* Features menu */}
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 14px',
            borderRadius: '9px',
            border: `1px solid ${open ? '#2e2e2e' : '#1e1e1e'}`,
            background: open ? '#141414' : '#0e0e0e',
            color: active ? active.accent : '#aaa',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {active ? (
            <>
              <span style={{ fontSize: '13px' }}>{active.icon}</span>
              <span>{active.title}</span>
            </>
          ) : (
            <span>Features</span>
          )}
          <span style={{
            fontSize: '10px',
            color: '#555',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.18s',
            marginLeft: '2px',
          }}>
            ▾
          </span>
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 'min(340px, calc(100vw - 2rem))',
            background: '#0d0d0d',
            border: '1px solid #222',
            borderRadius: '16px',
            padding: '10px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}>
            {CATEGORIES.map((cat, ci) => (
              <div key={cat} style={{ marginTop: ci === 0 ? 0 : '10px' }}>
                <p style={{
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: '#3a3a3a',
                  padding: '6px 10px 4px',
                }}>
                  {cat.toUpperCase()}
                </p>
                {FEATURES.filter(f => f.category === cat).map(f => {
                  const isActive = f.href === pathname
                  return (
                    <Link
                      key={f.href}
                      href={f.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '11px',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        background: isActive ? '#161616' : 'transparent',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#131313' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{
                        width: '30px',
                        height: '30px',
                        flexShrink: 0,
                        borderRadius: '8px',
                        background: f.gradientFrom,
                        border: `1px solid ${f.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}>
                        {f.icon}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: isActive ? f.accent : '#e0e0e0',
                          lineHeight: '1.3',
                        }}>
                          {f.title}
                        </span>
                        <span style={{
                          display: 'block',
                          fontSize: '11px',
                          color: '#555',
                          lineHeight: '1.35',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {f.short}
                        </span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      </div>
    </header>
  )
}
