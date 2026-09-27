import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-up sm:animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-coral-500" />
            <h2 className="font-bold text-navy-900 text-lg">Mi Carrito</h2>
            <span className="px-2 py-0.5 bg-coral-100 text-coral-700 text-xs font-bold rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-navy-900 text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">{item.variant.player_name} • Talla {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.size, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-coral-300 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.size, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-coral-300 transition-colors disabled:opacity-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-900 text-sm">${item.product.price * item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant.id, item.size)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-navy-900">${totalPrice} USD</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Vaciar
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold transition-all shadow-lg shadow-coral-500/30"
              >
                Pedir por WhatsApp 💬
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
