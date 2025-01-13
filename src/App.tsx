import React, { useState } from 'react';
import { YoutubeIcon, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl: url }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Video summary generated and saved successfully!');
        console.log('Summary saved successfully:', data);
        // Navigate to the summary page
        navigate('/summary',{
          state: {
            title: data.data.title,
            summary: data.data.summary,
            description: data.data.description,
            topics: data.data.topics || [],
          },
        });
      } else {
        setError(data.error || 'Failed to summarize the video.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <YoutubeIcon className="h-16 w-16 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              YouTube Video Summarizer
            </h1>
            <p className="text-lg text-gray-600">
              Get quick, AI-powered summaries of any YouTube video
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium 
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 active:bg-red-800'} 
                  transition-colors flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Generate Summary
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-600">
                {successMessage}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="h-6 w-6 text-red-600" />,
                title: 'Concise Summaries',
                description: 'Get the key points from any video in seconds',
              },
              {
                icon: <YoutubeIcon className="h-6 w-6 text-red-600" />,
                title: 'Any YouTube Video',
                description: 'Works with any public YouTube video URL',
              },
              {
                icon: <AlertCircle className="h-6 w-6 text-red-600" />,
                title: 'Save Time',
                description: 'Quick understanding without watching full videos',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center shadow-md"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;