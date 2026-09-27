import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { X, ChevronLeft, Check, User, Ruler, ChevronRight, Maximize2 } from 'lucide-react';

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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

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

  // Cerrar fullscreen con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fullscreenImage, onClose]);

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

  const openFullscreen = () => {
    if (images[currentImageIndex]) {
      setFullscreenImage(images[currentImageIndex]);
    }
  };

  // Fullscreen Image Modal
  if (fullscreenImage) {
    return (
      <div 
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
        onClick={() => setFullscreenImage(null)}
      >
        <button
          onClick={() => setFullscreenImage(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <img 
          src={fullscreenImage} 
          alt={product.name}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); setFullscreenImage(images[currentImageIndex - 1 < 0 ? images.length - 1 : currentImageIndex - 1]); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); setFullscreenImage(images[(currentImageIndex + 1) % images.length]); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 text-white text-sm font-medium rounded-full">
              {images.indexOf(fullscreenImage) + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full max-w-[400px] sm:max-w-[480px] max-h-[90vh] rounded-2xl overflow-hidden flex flex-col animate-fade-in shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            {selectedVariant && (
              <button
                onClick={() => { setSelectedVariant(null); setSelectedSize(''); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-navy-900 text-sm truncate">{product.name}</h2>
              {selectedVariant && (
                <p className="text-xs text-coral-600 font-medium truncate">
                  {selectedVariant.player_name}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Carousel */}
          <div className="aspect-square bg-gray-50 relative overflow-hidden cursor-pointer" onClick={openFullscreen}>
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${product.name} - Imagen ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Botón de pantalla completa */}
                <button
                  onClick={(e) => { e.stopPropagation(); openFullscreen(); }}
                  className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-lg text-white transition-colors"
                  title="Ver en pantalla completa"
                >
                  <Maximize2 size={16} />
                </button>
                
                {/* Navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
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
              <div className="flex gap-2 overflow-x-auto">
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

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Price & Team */}
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.team}</p>
              {hasSale ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-coral-600">${product.price} USD</span>
                  <span className="text-base text-gray-400 line-through">${product.original_price} USD</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-navy-900">${product.price} USD</span>
              )}
              {product.is_preorder && (
                <p className="text-sm text-navy-600 mt-2 flex items-center gap-1.5">
                  <span>🕐</span> Por encargo · Entrega en {product.delivery_days || 7} días
                </p>
              )}
            </div>

            {/* Selection */}
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
                      className={`min-w-[56px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? 'bg-coral-500 text-white border-coral-500 shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-coral-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <button
                    onClick={handleAddNoVariants}
                    className="w-full mt-4 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold transition-all shadow-lg shadow-coral-500/30 active:scale-[0.98]"
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
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
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
                        className={`p-3 rounded-lg text-sm font-medium text-left transition-all border ${
                          isOutOfStock
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-coral-300 hover:bg-coral-50'
                        }`}
                      >
                        <div className="font-semibold truncate">{variant.player_name}</div>
                        {isOutOfStock ? (
                          <span className="block text-xs text-red-500 mt-0.5">Sin stock</span>
                        ) : variant.stock <= 3 ? (
                          <span className="block text-xs text-amber-600 mt-0.5">⚡ ¡Últimas {variant.stock}!</span>
                        ) : (
                          <span className="block text-xs text-gray-400 mt-0.5">{variant.stock} disponibles</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // PASO 2: ELEGIR TALLA
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ruler size={16} className="text-coral-500" />
                  <p className="font-medium text-navy-900">2. Elige talla:</p>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Jugador: <span className="font-semibold text-navy-800">{selectedVariant.player_name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[56px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? 'bg-coral-500 text-white border-coral-500 shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-coral-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && (
                  <div className="mt-4 space-y-2">
                    {cartQty > 0 && (
                      <p className="text-sm text-gray-500 text-center bg-gray-50 rounded-lg py-2">
                        🛒 Ya tienes {cartQty} en el carrito
                      </p>
                    )}
                    <button
                      onClick={handleAddToCart}
                      disabled={cartQty >= selectedVariant.stock}
                      className={`w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98] ${
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
