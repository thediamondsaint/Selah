// One-time generator for static character bios.
// Run with: node --env-file=.env.local --experimental-strip-types scripts/generate-bios.ts
//
// Writes app/characters/bios.json keyed by character name so the app never
// has to generate a bio at runtime.

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { ROSTER } from '../app/characters/roster.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../app/characters/bios.json')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function stripFences(text: string): string {
  const m = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
  return m ? m[1].trim() : text.trim()
}

async function generate(name: string, category: string, tagline: string) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: 'You are a biblical scholar and biographer. Write accurate, engaging, non-denominational profiles grounded in the biblical text. Respond with valid JSON only — no markdown, no extra text.',
    messages: [{
      role: 'user',
      content: `Write a profile of ${name} from the Bible (${category}, ${tagline}).

Respond with ONLY this JSON:
{
  "name": "${name}",
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
  })

  const raw = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  return JSON.parse(stripFences(raw))
}

const out: Record<string, unknown> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, 'utf8'))
  : {}

let done = 0
for (const c of ROSTER) {
  if (out[c.name]) {
    console.log(`✓ ${c.name} (cached, skipping)`)
    done++
    continue
  }
  try {
    process.stdout.write(`… ${c.name} `)
    out[c.name] = await generate(c.name, c.category, c.tagline)
    writeFileSync(OUT, JSON.stringify(out, null, 2))
    done++
    console.log(`done  [${done}/${ROSTER.length}]`)
  } catch (e) {
    console.error(`\n✗ ${c.name}:`, e instanceof Error ? e.message : e)
  }
}

console.log(`\nWrote ${done}/${ROSTER.length} bios to app/characters/bios.json`)
