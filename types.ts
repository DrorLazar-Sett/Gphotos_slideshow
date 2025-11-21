export interface Photo {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'blur' | 'flip';

export interface SlideshowConfig {
  interval: number; // in seconds
  transitionType: 'random' | TransitionType;
  fitMode: 'cover' | 'contain';
}