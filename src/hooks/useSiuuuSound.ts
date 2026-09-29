import { useCallback, useEffect, useRef } from 'react';

// URL del sonido SIUU de CR7 (fuente pública)
const SIUUU_SOUND_URL = 'https://www.myinstants.com/media/sounds/siuuu.mp3';

// Instancia global del audio para cachearlo
let cachedAudio: HTMLAudioElement | null = null;

export const useSiuuuSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Precargar el audio al montar el hook (una sola vez)
  useEffect(() => {
    if (!cachedAudio) {
      cachedAudio = new Audio(SIUUU_SOUND_URL);
      cachedAudio.volume = 0.6;
      cachedAudio.preload = 'auto';
      
      // Forzar la carga inmediata
      cachedAudio.load();
    }
    audioRef.current = cachedAudio;
  }, []);

  const playSiuuu = useCallback(() => {
    try {
      if (audioRef.current) {
        // Clonar el audio para permitir reproducción simultánea
        const audioClone = audioRef.current.cloneNode() as HTMLAudioElement;
        audioClone.volume = 0.6;
        audioClone.play().catch(error => {
          console.log('No se pudo reproducir el sonido SIUUU:', error);
        });
      }
    } catch (error) {
      console.log('Error al reproducir el sonido:', error);
    }
  }, []);

  return { playSiuuu };
};
