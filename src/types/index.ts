export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  original_price?: number;
  image_url: string; // Mantenido para compatibilidad
  is_preorder: boolean;
  delivery_days?: number;
  created_at?: string;
  variants?: ProductVariant[];
  images?: ProductImage[]; // Nuevo: múltiples imágenes
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  player_name: string;
  sizes: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  size: string;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}

export interface BusinessSettings {
  id?: string;
  business_name: string;
  whatsapp_number: string;
  email: string;
  address: string;
  description: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
}
