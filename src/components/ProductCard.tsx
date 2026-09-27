import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Clock, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { items } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);

  const inCart = items.some(item => item.product.id === product.id);
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const hasSale = product.original_price && product.original_price > product.price;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-coral-100 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div
        className="relative aspect-square bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => onSelect(product)}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_preorder && (
            <span className="px-2.5 py-1 bg-navy-900/90 text-white text-xs font-medium rounded-lg backdrop-blur-sm">
              🕐 Por encargo
            </span>
          )}
          {hasSale && (
            <span className="px-2.5 py-1 bg-coral-500 text-white text-xs font-bold rounded-lg">
              🔥 OFERTA
            </span>
          )}
          {!product.is_preorder && totalStock <= 5 && totalStock > 0 && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg">
              ⚡ Últimas {totalStock}
            </span>
          )}
        </div>

        {inCart && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-navy-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.team}</p>

        {/* Price */}
        <div className="mb-3">
          {hasSale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-coral-600">${product.price} USD</span>
              <span className="text-sm text-gray-400 line-through">${product.original_price} USD</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-navy-900">${product.price} USD</span>
          )}
        </div>

        {/* Variant info */}
        <div className="text-xs text-gray-500 mb-3 space-y-0.5">
          {product.variants && product.variants.length > 0 && (
            <p>* {product.variants.length} jugador{product.variants.length > 1 ? 'es' : ''}</p>
          )}
          {product.is_preorder && product.delivery_days && (
            <p>* Entrega en {product.delivery_days} días</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => onSelect(product)}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            product.is_preorder
              ? 'bg-navy-50 text-navy-700 hover:bg-navy-100 border border-navy-200'
              : 'bg-coral-500 text-white hover:bg-coral-600 shadow-sm hover:shadow-md'
          }`}
        >
          {product.is_preorder ? (
            <><Clock size={15} /> Encargo</>
          ) : (
            <><ShoppingBag size={15} /> Elegir</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
