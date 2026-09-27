import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const { settings } = useBusiness();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-coral-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-coral-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          <Sparkles size={14} className="sm:w-4 sm:h-4" />
          <span>Nuevos diseños disponibles</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
          {settings.business_name}
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
          {settings.description}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <a
            href="#catalogo"
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-coral-500/30 hover:shadow-coral-500/50 active:scale-95 text-sm sm:text-base"
          >
            Ver Catálogo
          </a>
          <a
            href="#info"
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-200 active:scale-95 text-sm sm:text-base"
          >
            Más Info
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
