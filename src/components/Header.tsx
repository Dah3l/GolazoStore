import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';

interface HeaderProps {
  onCartOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartOpen }) => {
  const { totalItems } = useCart();
  const { settings } = useBusiness();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚽</span>
          </div>
          <span className="font-bold text-navy-900 text-lg">{settings.business_name}</span>
        </div>

        <button
          onClick={onCartOpen}
          className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-coral-50 border border-gray-200 hover:border-coral-200 transition-all duration-200 active:scale-95"
        >
          <ShoppingCart size={22} className="text-navy-800" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-coral-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
