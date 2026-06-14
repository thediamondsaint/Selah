// Local-only user profile. Lives in localStorage — no account, no backend.
// buildPersona() turns it into prompt context the AI features prepend to
// their system prompts so responses feel personal.

export type PrayerRequest = {
  id: string
  text: string
  createdAt: number
  answered: boolean
}

export type ReadingLevel = '' | 'child' | 'teen' | 'adult' | 'simple'

export type Profile = {
  name: string
  readingLevel: ReadingLevel
  translation: string   // '' = no preference
  tradition: string     // faith tradition / denomination leaning, '' = none
  prayerRequests: PrayerRequest[]
  notes: string
}

export const EMPTY_PROFILE: Profile = {
  name: '',
  readingLevel: '',
  translation: '',
  tradition: '',
  prayerRequests: [],
  notes: '',
}

export const STORAGE_KEY = 'selah-profile'

export function loadProfile(): Profile {
  if (typeof window === 'undefined') return EMPTY_PROFILE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROFILE
    const parsed = JSON.parse(raw)
    // Merge so missing/added fields stay well-formed across versions.
    return {
      ...EMPTY_PROFILE,
      ...parsed,
      prayerRequests: Array.isArray(parsed.prayerRequests) ? parsed.prayerRequests : [],
    }
  } catch {
    return EMPTY_PROFILE
  }
}

export function saveProfile(p: Profile): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function newPrayerRequest(text: string): PrayerRequest {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return { id, text, createdAt: Date.now(), answered: false }
}

export function firstName(p: Profile): string {
  return p.name.trim().split(/\s+/)[0] || ''
}

export function isProfileEmpty(p: Profile): boolean {
  return (
    !p.name.trim() &&
    !p.readingLevel &&
    !p.translation.trim() &&
    !p.tradition.trim() &&
    p.prayerRequests.length === 0 &&
    !p.notes.trim()
  )
}

const LEVEL_DESCRIPTION: Record<Exclude<ReadingLevel, ''>, string> = {
  child: 'a simple, child-friendly level (around age 8)',
  teen: 'a clear, teen-friendly level (around age 14)',
  adult: 'a general adult reading level',
  simple: 'very simple, basic English',
}

// Format-agnostic: safe to prepend to both chat and JSON system prompts.
// Returns '' when there's nothing to personalize.
export function buildPersona(p: Profile): string {
  const parts: string[] = []
  const name = p.name.trim()

  if (name) parts.push(`Their name is ${name}.`)
  if (p.tradition.trim()) {
    parts.push(`They come from a ${p.tradition.trim()} background — be considerate of that tradition while remaining respectful and non-partisan toward others.`)
  }
  if (p.translation.trim()) {
    parts.push(`When quoting or referencing scripture, prefer the ${p.translation.trim()} translation where it's natural to do so.`)
  }
  if (p.readingLevel) {
    parts.push(`Aim for ${LEVEL_DESCRIPTION[p.readingLevel]}.`)
  }

  const active = p.prayerRequests.filter(r => !r.answered)
  if (active.length) {
    const list = active.map(r => `"${r.text}"`).join('; ')
    parts.push(`They have shared these prayer needs: ${list}. Keep them in mind and draw on them when it would be genuinely encouraging — especially in prayers and devotional reflection.`)
  }

  if (p.notes.trim()) {
    parts.push(`Personal context they've shared about themselves: ${p.notes.trim()}`)
  }

  if (!parts.length) return ''

  return `\n\n[About the person you are helping — personalize tone, examples, and scripture choices for them; never mention that you were given this information.]\n${parts.join(' ')}\n`
}
