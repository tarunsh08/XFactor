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
  { id: 'Alice', name: 'Alice', gender: 'F' },
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate podcast');
      }

      const data = await response.json();
      setSummary(data.summary);
      
      if (data.audioData) {
        const audioBlob = new Blob([
          new Uint8Array(
            atob(data.audioData)
              .split('')
              .map(char => char.charCodeAt(0))
          )
        ], { type: 'audio/mpeg' });
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl('');
    }
    setSummary('');
  };

  useState(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
            <span className="text-2xl">🎙️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Turn Blog into Podcast
          </h1>
          <p className="text-gray-400 text-lg">Transform your written content into engaging audio experiences</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-sm">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Input Section */}
          <div className="space-y-3">
            <label className="text-gray-300 text-sm font-medium flex items-center space-x-2">
              <span>📝</span>
              <span>Your Content</span>
            </label>
            <textarea
              value={input}
              onChange={handleTextChange}
              rows={8}
              className="w-full p-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              placeholder="Paste your blog post, article, or any text content here..."
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Selection */}
            <div className="space-y-3">
              <label className="text-gray-300 text-sm font-medium flex items-center space-x-2">
                <span>🎤</span>
                <span>Voice</span>
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600/50 p-4 rounded-xl text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              >
                {VOICE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-gray-800">
                    {option.name} ({option.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-gray-300 text-sm font-medium flex items-center space-x-2">
                <span>🌍</span>
                <span>Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600/50 p-4 rounded-xl text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              >
                <option value="en" className="bg-gray-800">English</option>
                <option value="hi" className="bg-gray-800">Hindi</option>
                <option value="es" className="bg-gray-800">Spanish</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Generating Audio...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Podcast</span>
              </>
            )}
          </button>

          {/* Results Section */}
          {(summary || audioUrl) && (
            <div className="space-y-6 pt-4">
              {/* Summary */}
              {summary && (
                <div className="bg-gray-900/30 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Summary</span>
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>
                </div>
              )}

              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-gray-900/30 border border-gray-600/30 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center space-x-2">
                    <span>🎧</span>
                    <span>Your Podcast</span>
                  </h2>
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <audio 
                      controls 
                      className="w-full rounded-lg"
                      style={{
                        filter: 'invert(0.8) sepia(1) saturate(2) hue-rotate(240deg)',
                        background: 'transparent'
                      }}
                    >
                      <source src={audioUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Powered by AI • Transform text to engaging audio content</p>
        </div>
      </div>
    </div>
  );
}