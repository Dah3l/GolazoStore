import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Instagram, Facebook, Send, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const { settings } = useBusiness();

  return (
    <footer className="bg-navy-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="https://yyfpiyjwtrrvrsbmtgog.supabase.co/storage/v1/object/public/products/Logo/SAVE_20260927_150213.jpg" 
                alt="Golazo Store" 
                className="w-9 h-9 rounded-xl object-cover"
              />
              <span className="font-bold text-lg">{settings.business_name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{settings.description}</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-coral-400">Contacto</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {settings.email && <p className="flex items-center gap-2"><Mail size={14} /> {settings.email}</p>}
              {settings.address && <p className="flex items-center gap-2"><span>📍</span> {settings.address}</p>}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3 text-coral-400">Síguenos</h4>
            <div className="flex gap-3">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-coral-500 transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-coral-500 transition-colors">
                  <Facebook size={18} />
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-coral-500 transition-colors">
                  <Send size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {settings.business_name}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Hecho con <Heart size={12} className="text-coral-500" /> para nuestros clientes
          </p>
          <a href="/admin/login" className="text-xs text-gray-600 hover:text-coral-400 transition-colors">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
