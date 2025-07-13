// api/podify/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import 'dotenv/config';

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateElevenLabsAudio(text: string, voiceId: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return await response.arrayBuffer();
}

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    // Summarize the text using GPT
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a podcast summarizer. Generate a concise and engaging summary of the given text that would work well as a podcast episode. Keep it natural and conversational.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const summaryChoice = summaryResponse.choices[0];
    if (!summaryChoice || !summaryChoice.message || !summaryChoice.message.content) {
      throw new Error('Failed to get summary from OpenAI response');
    }
    const summary = summaryChoice.message.content;

    // Generate audio using ElevenLabs API
    const audioData = await generateElevenLabsAudio(summary, voice);
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    return NextResponse.json({
      summary,
      audioUrl,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}