import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, items } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [step, setStep] = useState(1);
  const [added, setAdded] = useState(false);

  const hasSale = product.original_price && product.original_price > product.price;

  const handleAddToCart = () => {
    if (selectedVariant && selectedSize) {
      addToCart(product, selectedVariant, selectedSize);
      setAdded(true);
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  const cartQty = items.reduce((sum, item) => {
    if (item.product.id === product.id && item.variant.id === selectedVariant?.id && item.size === selectedSize) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-navy-900 text-lg">{product.name}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Image */}
        <div className="aspect-square bg-gray-50">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Price */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500 mb-1">{product.team}</p>
          {hasSale ? (
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-coral-600">${product.price} USD</span>
              <span className="text-base text-gray-400 line-through">${product.original_price} USD</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-navy-900">${product.price} USD</span>
          )}
          {product.is_preorder && (
            <p className="text-sm text-navy-600 mt-1">🕐 Por encargo - Entrega en {product.delivery_days || 7} días</p>
          )}
        </div>

        {/* Steps */}
        <div className="px-5 py-4">
          {added ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <p className="font-semibold text-green-700 text-lg">¡Agregado al carrito!</p>
            </div>
          ) : step === 1 ? (
            <>
              <p className="font-medium text-navy-900 mb-3">1. Elige jugador:</p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {product.variants?.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => { setSelectedVariant(variant); setStep(2); setSelectedSize(''); }}
                    className={`p-3 rounded-xl text-sm font-medium text-left transition-all border ${
                      selectedVariant?.id === variant.id
                        ? 'bg-coral-50 border-coral-300 text-coral-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-coral-200 hover:bg-coral-50/50'
                    }`}
                  >
                    {variant.player_name}
                    {variant.stock <= 3 && variant.stock > 0 && (
                      <span className="block text-xs text-amber-600 mt-0.5">¡Últimas {variant.stock}!</span>
                    )}
                    {variant.stock === 0 && (
                      <span className="block text-xs text-red-500 mt-0.5">Sin stock</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-navy-900">2. Elige talla:</p>
                <button onClick={() => setStep(1)} className="text-sm text-coral-600 hover:underline">
                  ← Cambiar jugador
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Jugador: <span className="font-medium text-navy-800">{selectedVariant?.player_name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedVariant?.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      selectedSize === size
                        ? 'bg-coral-500 text-white border-coral-500 shadow-md'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-coral-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Add to cart button */}
              {selectedSize && selectedVariant && (
                <div className="mt-6 space-y-3">
                  {cartQty > 0 && (
                    <p className="text-sm text-gray-500 text-center">
                      Ya tienes {cartQty} en el carrito
                    </p>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartQty >= selectedVariant.stock}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
                      cartQty >= selectedVariant.stock
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-coral-500 hover:bg-coral-600 shadow-lg shadow-coral-500/30'
                    }`}
                  >
                    {cartQty >= selectedVariant.stock ? 'Stock máximo alcanzado' : 'Agregar al carrito 🛒'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
