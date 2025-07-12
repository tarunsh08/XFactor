import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { ElevenLabsClient as ElevenLabs } from '@elevenlabs/elevenlabs-js';
import 'dotenv/config';

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenLabs = new ElevenLabs(process.env.ELEVENLABS_API_KEY);
    
export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    //Summarize the text using GPT
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

    //Generate audio using ElevenLabs
    const audio = await elevenLabs.generateAudio(summary, voice);

    //Save audio to Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // TODO: Implement Supabase storage
    // This is a placeholder URL - you'll need to implement actual storage
    const audioUrl = `${supabaseUrl}/storage/v1/object/public/podcasts/${Date.now()}.mp3`;

    return NextResponse.json({
      summary,
      audioUrl,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}
