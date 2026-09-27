import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ShoppingBag, Search, Filter, ShoppingCart, MessageSquare } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('sportwear_onboarding_v3');
    if (!seen) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const close = () => {
    localStorage.setItem('sportwear_onboarding_v3', 'true');
    setShow(false);
  };

  const steps = [
    { icon: '👋', title: '¡Bienvenido!', desc: 'Te guiaremos por la tienda en unos pasos rápidos.' },
    { icon: '🔍', title: 'Busca y filtra', desc: 'Usa el buscador para encontrar tu camiseta favorita. Filtra por equipo, talla o disponibilidad.' },
    { icon: '🔥', title: 'Ofertas especiales', desc: 'Activa el filtro "Solo ofertas" para ver productos con descuento. ¡Ahorra en tus compras!' },
    { icon: '👕', title: 'Elige tu estilo', desc: 'Selecciona jugador, talla y agrega al carrito. Los productos en stock se entregan rápido.' },
    { icon: '🛒', title: 'Tu carrito', desc: 'Revisa tus productos, ajusta cantidades. El carrito se guarda automáticamente.' },
    { icon: '💬', title: 'Pide por WhatsApp', desc: 'Envía tu pedido directamente por WhatsApp con toda la info lista. ¡Así de fácil!' },
    { icon: '📦', title: 'Stock vs Encargo', desc: 'Los productos en stock aparecen primero. Los de encargo tienen tiempo de entrega estimado.' },
    { icon: '🎉', title: '¡Listo!', desc: 'Ya sabes todo lo necesario. ¡Disfruta comprando!' },
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-sm w-full p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={close} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100">
          <X size={18} className="text-gray-400" />
        </button>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-coral-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{steps[step].icon}</div>
          <h3 className="font-bold text-navy-900 text-xl mb-2">{steps[step].title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{steps[step].desc}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={close} className="text-sm text-gray-500 hover:text-coral-600 transition-colors">
            Saltar
          </button>
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(step + 1);
              else close();
            }}
            className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-1"
          >
            {step < steps.length - 1 ? 'Siguiente' : 'Empezar'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
