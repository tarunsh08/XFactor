'use client';

import { useState } from 'react';

export default function PodcastPage() {
  const [input, setInput] = useState('');
  const [voice, setVoice] = useState('Rachel');
  const [language, setLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setAudioUrl('');

    try {
      // (replace with real API)
      setTimeout(() => {
        setAudioUrl('/sample.mp3'); // Replace kro with dynamic audio URL
        setLoading(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">🎙️ Turn Blog into Podcast</h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
            <option value="Rachel">Rachel (F)</option>
            <option value="Adam">Adam (M)</option>
            <option value="Bella">Bella (F)</option>
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
