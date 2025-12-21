// Product variation system with attributes, SKUs, and inventory management

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariation {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { Size: "L", Color: "Red" }
  price: number;
  originalPrice: number;
  stock: number;
  lowStockThreshold: number;
  image?: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description?: string;
  category?: string;
  cloth_type: string; // Added cloth type attribute
  basePrice: number;
  baseOriginalPrice: number;
  rating: number;
  reviews: number;
  discount: number;
  images: string[];
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  model?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: number;
  variationId: string;
  sku: string;
  name: string;
  brand: string;
  cloth_type: string; // Added cloth type attribute
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  attributes: Record<string, string>;
  stock: number;
  addedAt: Date;
}

export interface StockAlert {
  productId: number;
  productName: string;
  variationId: string;
  variationName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  alertType: 'low_stock' | 'out_of_stock';
  createdAt: Date;
}

// Helper functions for variation management
export const generateSKU = (productId: number, attributes: Record<string, string>): string => {
  const prefix = `PRD${productId.toString().padStart(3, '0')}`;
  const suffix = Object.values(attributes)
    .map(value => value.toUpperCase().replace(/\s+/g, '-'))
    .join('-');
  return `${prefix}-${suffix}`;
};

export const getVariationDisplayName = (attributes: Record<string, string>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

export const isVariationInStock = (variation: ProductVariation): boolean => {
  return variation.isActive && variation.stock > 0;
};

export const getStockStatus = (variation: ProductVariation): {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  message: string;
  color: string;
} => {
  if (!variation.isActive) {
    return { status: 'out_of_stock', message: 'Unavailable', color: 'gray' };
  }
  
  if (variation.stock === 0) {
    return { status: 'out_of_stock', message: 'Sold Out', color: 'red' };
  }
  
  if (variation.stock <= variation.lowStockThreshold) {
    return { 
      status: 'low_stock', 
      message: `Only ${variation.stock} left`, 
      color: 'orange' 
    };
  }
  
  return { status: 'in_stock', message: 'In Stock', color: 'green' };
};
