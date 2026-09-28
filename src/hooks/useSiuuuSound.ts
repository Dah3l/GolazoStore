import { useCallback } from 'react';

// URL del sonido SIUU de CR7 (fuente pública)
const SIUUU_SOUND_URL = 'https://www.myinstants.com/media/sounds/siuuu.mp3';

export const useSiuuuSound = () => {
  const playSiuuu = useCallback(() => {
    try {
      const audio = new Audio(SIUUU_SOUND_URL);
      audio.volume = 0.6; // 60% del volumen para no ser tan fuerte
      audio.play().catch(error => {
        console.log('No se pudo reproducir el sonido SIUUU:', error);
      });
    } catch (error) {
      console.log('Error al crear el audio:', error);
    }
  }, []);

  return { playSiuuu };
};
