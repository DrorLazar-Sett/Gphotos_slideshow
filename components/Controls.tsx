import React from 'react';
import { Play, Pause, Maximize, X, SkipForward, SkipBack, Settings } from 'lucide-react';
import { SlideshowConfig, TransitionType } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  config: SlideshowConfig;
  onUpdateConfig: (key: keyof SlideshowConfig, value: any) => void;
  isVisible: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onExit,
  config,
  onUpdateConfig,
  isVisible,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 flex flex-col items-center justify-end gap-4 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl w-full max-w-md text-sm text-gray-300 animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Settings</h3>
            <button onClick={() => setShowSettings(false)} className="hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>Interval</label>
              <select 
                value={config.interval}
                onChange={(e) => onUpdateConfig('interval', Number(e.target.value))}
                className="bg-white/10 border border-white/10 rounded px-2 py-1"
              >
                <option value={3}>3s</option>
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label>Transition</label>
              <select 
                value={config.transitionType}
                onChange={(e) => onUpdateConfig('transitionType', e.target.value as TransitionType)}
                className="bg-white/10 border border-white/10 rounded px-2 py-1"
              >
                <option value="random">Random</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="flip">Flip</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label>Fit Mode</label>
              <div className="flex bg-white/10 rounded p-1">
                 <button 
                   onClick={() => onUpdateConfig('fitMode', 'cover')}
                   className={`px-3 py-1 rounded text-xs ${config.fitMode === 'cover' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
                 >
                   Cover
                 </button>
                 <button 
                   onClick={() => onUpdateConfig('fitMode', 'contain')}
                   className={`px-3 py-1 rounded text-xs ${config.fitMode === 'contain' ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
                 >
                   Contain
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="flex items-center gap-6 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl">
        <button onClick={onExit} className="text-white/70 hover:text-white transition-colors" title="Exit">
          <X size={24} />
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-2" />

        <button onClick={onPrev} className="text-white hover:text-blue-400 transition-colors transform active:scale-95">
          <SkipBack size={28} />
        </button>

        <button 
          onClick={onTogglePlay} 
          className="bg-white text-black p-4 rounded-full hover:bg-gray-200 transition-all transform hover:scale-110 active:scale-95 shadow-lg shadow-white/20"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={onNext} className="text-white hover:text-blue-400 transition-colors transform active:scale-95">
          <SkipForward size={28} />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className={`transition-colors ${showSettings ? 'text-blue-400' : 'text-white/70 hover:text-white'}`}
          title="Settings"
        >
          <Settings size={24} />
        </button>

        <button onClick={() => document.documentElement.requestFullscreen()} className="text-white/70 hover:text-white transition-colors" title="Fullscreen">
          <Maximize size={24} />
        </button>
      </div>
    </div>
  );
};

export default Controls;