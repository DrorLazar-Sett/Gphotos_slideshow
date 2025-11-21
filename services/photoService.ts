import { Photo } from '../types';

// We use multiple proxies to ensure reliability. 
// If one fails (due to rate limiting, CORS issues, or network errors), we try the next.
const PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

export const extractPhotosFromAlbum = async (albumUrl: string): Promise<Photo[]> => {
  // Basic validation
  if (!albumUrl.includes('photos.app.goo.gl') && !albumUrl.includes('photos.google.com')) {
    throw new Error('Please provide a valid Google Photos album link.');
  }

  let html = '';
  let lastError: any;

  // Try proxies sequentially
  for (const getProxyUrl of PROXIES) {
    try {
      const proxyUrl = getProxyUrl(albumUrl);
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        console.warn(`Proxy ${proxyUrl} returned status ${response.status}`);
        continue;
      }
      
      const text = await response.text();
      // Simple validation to check if we got some content
      if (text && text.length > 1000) {
        html = text;
        break;
      }
    } catch (error) {
      console.warn(`Proxy fetch failed for ${albumUrl}`, error);
      lastError = error;
    }
  }

  if (!html) {
    throw new Error('Failed to fetch album data. The album might be private or the connection failed.');
  }
    
  // Google Photos embeds images in script tags. We use regex to find them.
  // The pattern looks for typical Google hosted image URLs.
  const photoSet = new Set<string>();
  
  // Regex to match standard Googleusercontent URLs.
  // matches https://lh3.googleusercontent.com/ followed by non-quote/non-space chars.
  // This allows for paths like /pw/... and other ID formats.
  const regex = /(https:\/\/lh[0-9]+\.googleusercontent\.com\/[^"'\s\\]+)/g;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    let url = match[1];
    
    // Clean up the URL: remove existing size parameters if present.
    // Standard Google URLs often end with =w... or have no params.
    // We want the base URL so we can append our own high-res params.
    const equalSignIndex = url.indexOf('=');
    if (equalSignIndex !== -1) {
      url = url.substring(0, equalSignIndex);
    }

    // Filter out small icons or other assets by checking length
    // Real photo URLs are usually quite long (approx 40+ chars)
    if (url.length > 30) {
      photoSet.add(url);
    }
  }

  if (photoSet.size === 0) {
    // Fallback: try to detect if it's a login page
    if (html.includes('Sign in') || html.includes('ServiceLogin')) {
      throw new Error('This album appears to be private. Please make it public.');
    }
    throw new Error('No photos found. Please ensure the album is public and contains photos.');
  }

  const photos: Photo[] = Array.from(photoSet).map((url, index) => ({
    id: `photo-${index}`,
    // Append parameters to get high quality images. 
    // =w1920-h1080-no forces the resolution.
    url: `${url}=w1920-h1080-no`, 
  }));

  return photos;
};

export const getDemoPhotos = (): Photo[] => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `demo-${i}`,
    url: `https://picsum.photos/seed/${i + 123}/1920/1080`,
  }));
};

// Fisher-Yates shuffle
export const shufflePhotos = (photos: Photo[]): Photo[] => {
  const array = [...photos];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};