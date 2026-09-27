export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  original_price?: number;
  image_url: string;
  is_preorder: boolean;
  delivery_days?: number;
  created_at?: string;
  variants?: ProductVariant[];
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
