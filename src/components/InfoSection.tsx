import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ChevronDown, ChevronUp, Instagram, Facebook, Send, Mail, Phone, MapPin } from 'lucide-react';

const InfoSection: React.FC = () => {
  const { settings } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: '¿Cómo realizo un pedido?', a: 'Selecciona los productos, agrégalos al carrito y presiona "Pedir por WhatsApp". Se abrirá un chat con tu pedido prearmado.' },
    { q: '¿Cuánto tarda la entrega?', a: 'Los productos en stock se entregan en 24-48 horas. Los productos por encargo tardan según lo indicado en cada producto.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos transferencia, efectivo y pago móvil. Coordina el método al confirmar tu pedido por WhatsApp.' },
    { q: '¿Puedo cambiar o devolver un producto?', a: 'Sí, tienes 48 horas para solicitar un cambio si el producto tiene algún defecto. Contáctanos por WhatsApp.' },
    { q: '¿Hacen envíos a todas las provincias?', a: 'Sí, realizamos envíos a todo el país. El costo varía según la zona de entrega.' },
  ];

  return (
    <section id="info" className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 hover:border-coral-200 transition-all shadow-sm"
      >
        <span className="font-bold text-navy-900 text-lg">ℹ️ Más Información</span>
        {isOpen ? <ChevronUp size={20} className="text-coral-500" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-navy-900 mb-3">Sobre Nosotros</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{settings.description}</p>
            <div className="mt-4 space-y-2">
              {settings.email && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-coral-500" /> {settings.email}
                </p>
              )}
              {settings.address && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-coral-500" /> {settings.address}
                </p>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-navy-900 mb-3">Preguntas Frecuentes</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-navy-900">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-coral-500" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-3.5 pb-3.5 animate-fade-in">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InfoSection;
