import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, size: string) => void;
  removeFromCart: (productId: string, variantId: string, size: string) => void;
  updateQuantity: (productId: string, variantId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sportwear_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sportwear_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant, size: string) => {
    setItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.variant.id === variant.id && item.size === size
      );
      if (existing) {
        if (existing.quantity >= variant.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id && item.variant.id === variant.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, variant, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, variantId: string, size: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.variant.id === variantId && item.size === size)
    ));
  };

  const updateQuantity = (productId: string, variantId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId, size);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.variant.id === variantId && item.size === size) {
        if (quantity > item.variant.stock) return item;
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
