import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

const WhatsAppButton: React.FC = () => {
  const { settings } = useBusiness();

  const handleClick = () => {
    let phone = settings.whatsapp_number.replace(/\s/g, '');
    if (!phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const message = `Hola ${settings.business_name}! 👋 Me interesa información sobre sus productos.`;
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group active:scale-95"
      title="Contactar por WhatsApp"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-3 py-1.5 bg-navy-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
        Contáctanos
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-navy-900 rotate-45"></span>
      </span>
    </button>
  );
};

export default WhatsAppButton;
