import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { X, ChevronLeft, Check, User, Ruler, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, items } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasSale = product.original_price && product.original_price > product.price;
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  
  // Obtener imágenes del producto
  const images = product.images 
    ? product.images.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url)
    : product.image_url ? [product.image_url] : [];
  
  const hasMultipleImages = images.length > 1;

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddToCart = () => {
    if (selectedVariant && selectedSize) {
      addToCart(product, selectedVariant, selectedSize);
      setAdded(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const cartQty = items.reduce((sum, item) => {
    if (item.product.id === product.id && item.variant.id === selectedVariant?.id && item.size === selectedSize) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  // Si no hay variantes, agregar directo con talla única
  const handleAddNoVariants = () => {
    const fakeVariant: ProductVariant = {
      id: 'default',
      product_id: product.id,
      player_name: 'Sin personalizar',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 99,
    };
    if (selectedSize) {
      addToCart(product, fakeVariant, selectedSize);
      setAdded(true);
      setTimeout(() => onClose(), 1200);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {selectedVariant && (
              <button
                onClick={() => { setSelectedVariant(null); setSelectedSize(''); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-navy-900 text-base truncate">{product.name}</h2>
              {selectedVariant && (
                <p className="text-xs text-coral-600 font-medium truncate">
                  {selectedVariant.player_name}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Carousel */}
          <div className="aspect-square bg-gray-50 relative overflow-hidden">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${product.name} - Imagen ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                      <ChevronRight size={20} className="text-gray-700" />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
                
                {/* Dots indicator */}
                {hasMultipleImages && images.length <= 6 && (
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
            
            {hasSale && (
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-coral-500 text-white text-xs font-bold rounded-lg shadow-lg">
                🔥 OFERTA
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultipleImages && (
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-coral-500 scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1.5">{product.team}</p>
            {hasSale ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-coral-600">${product.price} USD</span>
                <span className="text-base text-gray-400 line-through">${product.original_price} USD</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-navy-900">${product.price} USD</span>
            )}
            {product.is_preorder && (
              <p className="text-sm text-navy-600 mt-1.5 flex items-center gap-1.5">
                <span>🕐</span> Por encargo · Entrega en {product.delivery_days || 7} días
              </p>
            )}
          </div>

          {/* Content */}
          <div className="px-4 py-4">
            {added ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <p className="font-semibold text-green-700 text-lg">¡Agregado al carrito!</p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedVariant?.player_name} · Talla {selectedSize}
                </p>
              </div>
            ) : !hasVariants ? (
              // SIN VARIANTES - Solo elegir talla
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ruler size={16} className="text-coral-500" />
                  <p className="font-medium text-navy-900">Elige tu talla:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? 'bg-coral-500 text-white border-coral-500 shadow-md scale-105'
                          : 'bg-gray-50 border-gray-200 text-gray-700 active:scale-95'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <button
                    onClick={handleAddNoVariants}
                    className="w-full mt-6 py-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold transition-all shadow-lg shadow-coral-500/30 active:scale-[0.98]"
                  >
                    Agregar al carrito 🛒
                  </button>
                )}
              </div>
            ) : !selectedVariant ? (
              // PASO 1: ELEGIR JUGADOR
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User size={16} className="text-coral-500" />
                  <p className="font-medium text-navy-900">1. Elige jugador:</p>
                  <span className="text-xs text-gray-400 ml-auto">{variants.length} disponibles</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map(variant => {
                    const isOutOfStock = variant.stock === 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          if (!isOutOfStock) {
                            setSelectedVariant(variant);
                            setSelectedSize('');
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`p-3.5 rounded-xl text-sm font-medium text-left transition-all border ${
                          isOutOfStock
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                            : 'bg-gray-50 border-gray-200 text-gray-700 active:scale-95 active:bg-coral-50 active:border-coral-300'
                        }`}
                      >
                        <div className="font-semibold">{variant.player_name}</div>
                        {isOutOfStock ? (
                          <span className="block text-xs text-red-500 mt-1">Sin stock</span>
                        ) : variant.stock <= 3 ? (
                          <span className="block text-xs text-amber-600 mt-1">⚡ ¡Últimas {variant.stock}!</span>
                        ) : (
                          <span className="block text-xs text-gray-400 mt-1">{variant.stock} disponibles</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // PASO 2: ELEGIR TALLA
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Ruler size={16} className="text-coral-500" />
                  <p className="font-medium text-navy-900">2. Elige talla:</p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Jugador: <span className="font-semibold text-navy-800">{selectedVariant.player_name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? 'bg-coral-500 text-white border-coral-500 shadow-md scale-105'
                          : 'bg-gray-50 border-gray-200 text-gray-700 active:scale-95'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <div className="mt-6 space-y-2">
                    {cartQty > 0 && (
                      <p className="text-sm text-gray-500 text-center bg-gray-50 rounded-lg py-2">
                        🛒 Ya tienes {cartQty} en el carrito
                      </p>
                    )}
                    <button
                      onClick={handleAddToCart}
                      disabled={cartQty >= selectedVariant.stock}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all active:scale-[0.98] ${
                        cartQty >= selectedVariant.stock
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-coral-500 hover:bg-coral-600 shadow-lg shadow-coral-500/30'
                      }`}
                    >
                      {cartQty >= selectedVariant.stock ? 'Stock máximo alcanzado' : 'Agregar al carrito 🛒'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
