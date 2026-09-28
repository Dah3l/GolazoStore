import React, { useState, useEffect } from 'react';
import { X, Wifi, Shield, Globe, Smartphone } from 'lucide-react';
import { useScrollPosition } from '../hooks/useScrollPosition';

const ConnectionHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isNearFooter = useScrollPosition();

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-50 bg-coral-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:bg-coral-600 transition-all duration-300 text-xs font-medium flex items-center gap-1.5 ${
          isNearFooter ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <Wifi size={14} />
        <span>¿Problemas?</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-navy-900 text-lg">Ayuda de Conexión</h3>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Si ves un error de conexión segura</strong>, es probable que sea un problema de red en Cuba. 
              Sigue estas soluciones:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-coral-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 text-sm">1. Usa VPN (Recomendado)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Descarga una app VPN gratuita como <strong>Psiphon</strong>, <strong>Turbo VPN</strong> o <strong>Lantern</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-coral-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 text-sm">2. Cambia tu DNS</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Configura DNS de Google: <code className="bg-gray-100 px-1 rounded">8.8.8.8</code> y <code className="bg-gray-100 px-1 rounded">8.8.4.4</code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <Smartphone size={20} className="text-coral-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 text-sm">3. Usa Opera Browser</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Opera tiene VPN integrada gratuita. Descárgalo desde Play Store
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-coral-100 rounded-full flex items-center justify-center">
                <Wifi size={20} className="text-coral-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900 text-sm">4. Usa Datos Móviles</h4>
                <p className="text-xs text-gray-600 mt-1">
                  A veces funciona mejor con datos móviles que con WiFi de ETECSA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Consejo:</strong> Intenta acceder en horarios de menor congestión (madrugada 1-6 AM o mediodía 12-2 PM)
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 text-center">
              ¿Sigues con problemas? Contáctanos por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionHelp;
