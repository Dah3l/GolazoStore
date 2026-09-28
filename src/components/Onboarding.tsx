import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ShoppingBag, Search, Filter, ShoppingCart, MessageSquare } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('golazo_onboarding_v5');
    if (!seen) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  const close = () => {
    localStorage.setItem('golazo_onboarding_v5', 'true');
    setShow(false);
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

  if (!show) return null;

  return (
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
              else close();
            }}
            className="flex-1 max-w-[200px] px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-coral-500/30 flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? 'Siguiente' : '¡Empezar!'} 
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
