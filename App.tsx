import React, { useState } from 'react';
import { extractPhotosFromAlbum, getDemoPhotos, shufflePhotos } from './services/photoService';
import Slideshow from './components/Slideshow';
import { Photo } from './types';
import { Image as ImageIcon, PlayCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  const handleStart = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const extractedPhotos = await extractPhotosFromAlbum(inputValue);
      const randomized = shufflePhotos(extractedPhotos);
      setPhotos(randomized);
      setIsSlideshowActive(true);
    } catch (err: any) {
      setError(err.message || "Failed to load album. Make sure it is a public Google Photos link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    const demo = getDemoPhotos();
    setPhotos(shufflePhotos(demo));
    setIsSlideshowActive(true);
  };

  if (isSlideshowActive) {
    return <Slideshow photos={photos} onExit={() => setIsSlideshowActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
             <ImageIcon size={48} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
            G-Photos Flow
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Turn any public Google Photos album into a cinematic, randomized slideshow with one click.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="url-input" className="text-sm font-medium text-gray-300 ml-1">
                Album Link
              </label>
              <div className="relative group">
                <input
                  id="url-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="https://photos.app.goo.gl/..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all group-hover:bg-black/50"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={isLoading || !inputValue}
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/10 relative overflow-hidden group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <PlayCircle size={24} />
                  <span>Start Slideshow</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-gray-500">Or try without a link</span>
              </div>
            </div>

            <button
              onClick={handleDemo}
              className="w-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Sparkles size={18} />
              <span>Launch Demo Experience</span>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Works best with public Google Photos shared links. <br/>
          No login required. Photos are processed locally in your browser.
        </p>
      </div>
    </div>
  );
}

export default App;