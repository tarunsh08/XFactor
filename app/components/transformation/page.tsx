'use client';

import { useState } from 'react';

interface VoiceOption {
  id: string;
  name: string;
  gender: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Rachel', name: 'Rachel', gender: 'F' },
  { id: 'Adam', name: 'Adam', gender: 'M' },
  { id: 'Bella', name: 'Bella', gender: 'F' },
];

export default function PodcastPage() {
  const [input, setInput] = useState('');
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].id);
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setAudioUrl('');
    setSummary('');

    try {
      const response = await fetch('/api/podify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          voice: voice,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate podcast');
      }

      const data = await response.json();
      setSummary(data.summary);
      setAudioUrl(data.audioUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setAudioUrl('');
    setSummary('');
  };

  return (
    <div className="min-h-screen bg-gray-400 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">🎙️ Turn Blog into Podcast</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <textarea
          value={input}
          onChange={handleTextChange}
          rows={8}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste blog/article URL or text here..."
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {VOICE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.gender})
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating Audio...' : 'Generate Podcast'}
        </button>

        {summary && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">📝 Summary:</h2>
            <div className="prose max-w-none">
              {summary}
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">🎧 Your Podcast:</h2>
            <audio controls className="w-full rounded-lg">
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
