import Anthropic from '@anthropic-ai/sdk'
import { unstable_cache } from 'next/cache'
import { createHash } from 'node:crypto'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-sonnet-4-6'

type Msg = { role: 'user' | 'assistant'; content: string }

// Claude occasionally wraps JSON in ```json ... ``` despite instructions — strip it.
function stripFences(text: string): string {
  const match = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
  return match ? match[1].trim() : text.trim()
}

// One non-streaming generation. Returns the final, fence-stripped text so the
// cached value is clean and ready to use.
async function generate(system: string, messages: Msg[], maxTok: number): Promise<string> {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: maxTok,
    system,
    messages,
  })
  const raw = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
  return stripFences(raw)
}

// Server-side cache, keyed by the full request. Identical inputs (including the
// common no-profile case) reuse a stored answer instead of calling the API.
// Backed by Next's Data Cache: durable across requests and deployments on the
// host, file-backed locally. Cached indefinitely (revalidate: false) to save
// as much API usage as possible.
async function generateCached(system: string, messages: Msg[], maxTok: number): Promise<string> {
  const key = createHash('sha256')
    .update(JSON.stringify({ model: MODEL, system, messages, maxTok }))
    .digest('hex')

  const run = unstable_cache(
    () => generate(system, messages, maxTok),
    ['ask', key],
    { revalidate: false, tags: ['ask'] },
  )
  return run()
}

export async function POST(req: Request) {
  try {
    const { system, messages, stream: useStream, max_tokens: maxTok, cache } = await req.json() as {
      system?: string
      messages: Msg[]
      stream?: boolean
      max_tokens?: number
      cache?: boolean
    }

    const sysPrompt = system || 'You are a helpful Bible study assistant.'

    // Streaming responses are inherently dynamic (chat, live prayer) and aren't cached.
    if (useStream) {
      const encoder = new TextEncoder()
      const body = new ReadableStream({
        async start(controller) {
          try {
            const stream = await client.messages.create({
              model: MODEL,
              max_tokens: maxTok ?? 2048,
              system: sysPrompt,
              messages,
              stream: true,
            })
            for await (const event of stream) {
              if (
                event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta'
              ) {
                controller.enqueue(encoder.encode(event.delta.text))
              }
            }
          } catch (e) {
            controller.error(e)
          } finally {
            controller.close()
          }
        },
      })
      return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const tokens = maxTok ?? 4096
    const text = cache === false
      ? await generate(sysPrompt, messages, tokens)
      : await generateCached(sysPrompt, messages, tokens)

    return Response.json({ text })
  } catch (e) {
    console.error('[api/ask]', e)
    return Response.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
