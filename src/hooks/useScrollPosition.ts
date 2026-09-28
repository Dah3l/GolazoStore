import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Detectar cuando estamos a 100px del final (footer)
      const threshold = 100;
      setIsNearFooter(scrollPosition >= documentHeight - threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar posición inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isNearFooter;
};
