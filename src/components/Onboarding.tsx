import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [showSiuuu, setShowSiuuu] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('golazo_onboarding_v5');
    if (!seen) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (show || showSiuuu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [show, showSiuuu]);

  const close = () => {
    localStorage.setItem('golazo_onboarding_v5', 'true');
    setShow(false);
  };

  const finishOnboarding = () => {
    setShow(false);
    setShowSiuuu(true);
    
    // Ocultar la animación después de 3 segundos
    setTimeout(() => {
      setShowSiuuu(false);
    }, 3000);
  };

  const steps = [
    { icon: '⚽', title: '¡Bienvenido a Golazo Store!', desc: 'Las mejores camisetas de fútbol al mejor precio. Te guiaremos en unos pasos rápidos.' },
    { icon: '🔍', title: 'Busca y filtra', desc: 'Usa el buscador para encontrar tu camiseta favorita. Filtra por equipo, talla, disponibilidad o solo ofertas.' },
    { icon: '🔥', title: 'Ofertas especiales', desc: 'Activa el filtro "Solo ofertas" para ver productos con descuento. ¡Ahorra en tus compras!' },
    { icon: '👕', title: 'Elige tu estilo', desc: 'Selecciona jugador, talla y agrega al carrito. Los productos en stock se entregan rápido.' },
    { icon: '🖼️', title: 'Múltiples fotos', desc: 'Haz clic en cualquier imagen para verla en pantalla completa. Navega entre fotos con flechas o miniaturas.' },
    { icon: '🛒', title: 'Tu carrito', desc: 'Revisa tus productos, ajusta cantidades. El carrito se guarda automáticamente en tu dispositivo.' },
    { icon: '📍', title: 'Zonas de entrega', desc: 'Selecciona tu localidad y punto de entrega específico. Cada zona tiene su propio precio.' },
    { icon: '💬', title: 'Pide por WhatsApp', desc: 'Envía tu pedido con toda la info lista: productos, zona de entrega y precio. ¡Así de fácil!' },
    { icon: '📦', title: 'Stock vs Encargo', desc: 'Los productos en stock aparecen primero. Los de encargo tienen tiempo de entrega estimado.' },
    { icon: '🟢', title: 'Contacto directo', desc: 'Usa el botón verde flotante para contactarnos directamente por WhatsApp con cualquier duda.' },
    { icon: '🎉', title: '¡Listo!', desc: 'Ya sabes todo lo necesario. ¡Disfruta comprando tus camisetas favoritas!' },
  ];

  // Si no hay nada que mostrar, retornar null
  if (!show && !showSiuuu) return null;

  return (
    <>
      {/* Animación SIUUU - Se muestra independientemente del modal */}
      {showSiuuu && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
          {/* Fondo oscuro semitransparente */}
          <div className="absolute inset-0 bg-black/70 animate-fade-in" />
          
          {/* Confeti/Partículas */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 1}s`
                }}
              />
            ))}
          </div>
          
          {/* Contenido principal */}
          <div className="relative text-center animate-siuuu-entrance">
            {/* Imagen de CR7 saltando */}
            <div className="mb-4 animate-bounce-siuuu">
              <img 
                src="https://yyfpiyjwtrrvrsbmtgog.supabase.co/storage/v1/object/public/products/Logo/IMG_20260928_193608.png" 
                alt="CR7 SIUUU" 
                className="max-w-[200px] md:max-w-[280px] h-auto object-contain"
              />
            </div>
            
            {/* Texto SIUUU */}
            <div className="relative">
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-coral-500 to-coral-600 animate-siuuu-text drop-shadow-2xl">
                SIUUU!!!
              </h1>
              {/* Efecto de brillo */}
              <div className="absolute inset-0 text-7xl md:text-9xl font-black text-white/20 blur-sm animate-pulse">
                SIUUU!!!
              </div>
            </div>
            
            {/* Subtítulo */}
            <p className="text-2xl md:text-3xl font-bold text-white mt-4 animate-fade-in-delay">
              ¡Bienvenido a Golazo Store! ⚽
            </p>
          </div>
        </div>
      )}

      {/* Modal del Onboarding */}
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">⚽ Golazo Store</span>
                </div>
                <button onClick={close} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Progress bar mejorado */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Paso {step + 1} de {steps.length}</span>
                <span className="text-xs font-medium text-coral-600">{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-coral-500 to-coral-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-coral-100 to-coral-200 rounded-full mb-5 shadow-lg">
                <div className="text-5xl">{steps[step].icon}</div>
              </div>
              <h3 className="font-bold text-navy-900 text-2xl mb-3">{steps[step].title}</h3>
              <p className="text-gray-600 text-base leading-relaxed px-2">{steps[step].desc}</p>
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              <button 
                onClick={close} 
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-coral-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                Saltar tutorial
              </button>
              <button
                onClick={() => {
                  if (step < steps.length - 1) setStep(step + 1);
                  else finishOnboarding();
                }}
                className="flex-1 max-w-[200px] px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-coral-500/30 flex items-center justify-center gap-2"
              >
                {step < steps.length - 1 ? 'Siguiente' : '¡Empezar!'} 
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Onboarding;
