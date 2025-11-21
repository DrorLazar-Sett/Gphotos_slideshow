import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo, SlideshowConfig, TransitionType } from '../types';
import Controls from './Controls';

interface SlideshowProps {
  photos: Photo[];
  onExit: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ photos, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [config, setConfig] = useState<SlideshowConfig>({
    interval: 5,
    transitionType: 'random',
    fitMode: 'cover',
  });
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mouseTimer, setMouseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Preload next images
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % photos.length;
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    const preload = [photos[nextIdx].url, photos[prevIdx].url];
    preload.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [currentIndex, photos]);

  const getNextTransition = (): TransitionType => {
    if (config.transitionType !== 'random') return config.transitionType;
    const types: TransitionType[] = ['fade', 'slide', 'zoom', 'flip'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const [activeTransition, setActiveTransition] = useState<TransitionType>('fade');

  const handleNext = useCallback(() => {
    setActiveTransition(getNextTransition());
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length, config.transitionType]);

  const handlePrev = useCallback(() => {
    setActiveTransition(getNextTransition());
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length, config.transitionType]);

  // Auto-play timer
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isPlaying) {
      intervalId = setInterval(handleNext, config.interval * 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, config.interval, handleNext]);

  // Hide controls on inactivity
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (mouseTimer) clearTimeout(mouseTimer);
    const timer = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 3000);
    setMouseTimer(timer);
  };

  useEffect(() => {
    if (!isPlaying) setControlsVisible(true);
  }, [isPlaying]);

  // Variants for animations
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-20%', opacity: 0 },
    },
    zoom: {
      initial: { scale: 1.2, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
    },
    flip: {
      initial: { rotateY: 90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 },
    },
    blur: {
      initial: { filter: 'blur(20px)', opacity: 0 },
      animate: { filter: 'blur(0px)', opacity: 1 },
      exit: { filter: 'blur(10px)', opacity: 0 },
    }
  };

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden z-50"
      onMouseMove={handleMouseMove}
      onClick={() => !controlsVisible && handleMouseMove()}
    >
      {/* Background blurred version for ambiance */}
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center transition-all duration-[2000ms] blur-3xl transform scale-110"
        style={{ backgroundImage: `url(${currentPhoto.url})` }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt="Slideshow"
            className={`max-w-full max-h-full shadow-2xl rounded-md ${config.fitMode === 'cover' ? 'w-full h-full object-cover' : 'object-contain'}`}
            variants={variants[activeTransition] || variants.fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <Controls 
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={onExit}
        config={config}
        onUpdateConfig={(k, v) => setConfig(prev => ({...prev, [k]: v}))}
        isVisible={controlsVisible}
      />
    </div>
  );
};

export default Slideshow;