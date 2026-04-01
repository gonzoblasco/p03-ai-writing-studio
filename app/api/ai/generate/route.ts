import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const VALID_TONES = ['professional', 'casual', 'creative', 'concise'] as const
type Tone = (typeof VALID_TONES)[number]

const SYSTEM_PROMPTS: Record<Tone, string> = {
  professional: 'Eres un escritor profesional. Redactá de forma clara, formal y directa.',
  casual: 'Eres un escritor cercano. Redactá de forma natural, conversacional y amigable.',
  creative: 'Eres un escritor creativo. Usá metáforas, variedad rítmica y lenguaje evocador.',
  concise: 'Eres un escritor conciso. Eliminá todo lo innecesario. Cada palabra debe justificarse.',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { prompt?: string; tone?: string; context?: string }
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const { prompt, tone, context = '' } = body

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return new Response('Missing required field: prompt', { status: 400 })
  }

  if (!tone || !VALID_TONES.includes(tone as Tone)) {
    return new Response(
      `Invalid or missing field: tone. Must be one of: ${VALID_TONES.join(', ')}`,
      { status: 400 }
    )
  }

  const userMessage =
    context && context.trim() !== ''
      ? `Contexto actual:\n${context}\n\nTarea:\n${prompt}`
      : prompt

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[tone as Tone],
      messages: [{ role: 'user', content: userMessage }],
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return new Response('Error communicating with AI API', { status: 500 })
  }
}
