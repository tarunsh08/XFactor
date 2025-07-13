import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
}

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VOICE_ID_MAP: { [key: string]: string } = {
  'Rachel': 'Xb7hH8MSUJpSbSDYk0k2',
  'Adam': 'pNInz6obpgDQGcFmaJgB',
  'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
};

async function getAvailableModels() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/models', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

async function getAvailableVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    return [];
  }
}

async function generateElevenLabsAudio(text: string, voiceId: string) {
  const actualVoiceId = VOICE_ID_MAP[voiceId] || voiceId;
  
  const modelsToTry = [
    "eleven_multilingual_v2",
    "eleven_multilingual_v1", 
    "eleven_monolingual_v1",
    "eleven_turbo_v2"
  ];
  
  let lastError: string = '';
  
  for (const modelId of modelsToTry) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text,
            model_id: modelId,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
              style: 0.0,
              use_speaker_boost: true
            }
          }),
        }
      );

      if (response.ok) {
        return await response.arrayBuffer();
      }
      
      const errorText = await response.text();
      lastError = errorText;
      console.log(`Model ${modelId} failed, trying next...`);
      
    } catch (error) {
      console.error(`Error with model ${modelId}:`, error);
      lastError = error instanceof Error ? error.message : 'Unknown error';
    }
  }
  
  throw new Error(`ElevenLabs API error with all models: ${lastError}`);
}

export async function POST(request: Request) {
  try {
    const { text, voice } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a podcast summarizer. Generate a concise and engaging summary of the following text that would work well as a podcast episode. Keep it natural and conversational. Here's the text to summarize:\n\n${text}`;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      if (!summary) {
        throw new Error('Failed to get summary from Gemini response');
      }

      const audioData = await generateElevenLabsAudio(summary, voice);
      
      return NextResponse.json({
        summary,
        audioData: Buffer.from(audioData).toString('base64'),
      });

    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      throw new Error(`Gemini API failed: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate podcast' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [voices, models] = await Promise.all([
      getAvailableVoices(),
      getAvailableModels()
    ]);
    return NextResponse.json({ voices, models });
  } catch (error) {
    console.error('Error fetching voices and models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices and models' },
      { status: 500 }
    );
  }
}