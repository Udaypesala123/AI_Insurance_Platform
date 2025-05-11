// app/api/llm/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Securely access API key from .env in root
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Securely access API key from .env in root
const systemPrompt =
  process.env.LLM_SYSTEM_MESSAGE;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Document:\n${text}` },
      ],
    });

    const name = response.choices[0].message.content?.trim() || 'Unknown';
    return NextResponse.json({ name });
  } catch (err) {
    console.error('LLM API error:', err);
    return NextResponse.json({ error: 'Failed to process with OpenAI' }, { status: 500 });
  }
}