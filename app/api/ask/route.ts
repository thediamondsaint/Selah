import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type Msg = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const { system, messages, stream: useStream } = await req.json() as {
    system?: string
    messages: Msg[]
    stream?: boolean
  }

  const sysPrompt = system || 'You are a helpful Bible study assistant.'

  if (useStream) {
    const encoder = new TextEncoder()
    const body = new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 2048,
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

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: sysPrompt,
    messages,
  })

  const text = message.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  return Response.json({ text })
}
