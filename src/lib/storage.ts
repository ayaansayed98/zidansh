// Local storage utilities for cart and favorites persistence

const CART_STORAGE_KEY = 'zidansh_cart_items';
const FAVORITES_STORAGE_KEY = 'zidansh_favorites';
const CART_COUNT_STORAGE_KEY = 'zidansh_cart_count';

export interface CartItem {
  cartItemId: string;
  productId: number;
  id: number; // Keep for backward compatibility
  name: string;
  brand: string;
  cloth_type: string; // Added cloth type attribute
  price: number;
  image: string;
  quantity: number;
  size?: string;
  model?: string;
  addedAt?: string;
}

export interface FavoriteItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  model?: string;
}

// Cart storage functions
export const saveCartItems = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart items to localStorage:', error);
  }
};

export const loadCartItems = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart items from localStorage:', error);
    return [];
  }
};

export const saveCartCount = (count: number): void => {
  try {
    localStorage.setItem(CART_COUNT_STORAGE_KEY, count.toString());
  } catch (error) {
    console.error('Failed to save cart count to localStorage:', error);
  }
};

export const loadCartCount = (): number => {
  try {
    const stored = localStorage.getItem(CART_COUNT_STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Failed to load cart count from localStorage:', error);
    return 0;
  }
};

// Favorites storage functions
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

export const loadFavorites = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return [];
  }
};

// Clear all stored data (useful for logout or reset)
export const clearAllStoredData = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(CART_COUNT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
};

// Recently Viewed Items
const RECENTLY_VIEWED_KEY = 'zidansh_recently_viewed';

export interface RecentlyViewedItem {
  id: number;
  name: string;
  image: string;
  price: number;
  viewedAt: number;
}

export const saveRecentlyViewed = (item: RecentlyViewedItem): void => {
  try {
    const existing = loadRecentlyViewed();
    // Remove if already exists (to bump to top)
    const filtered = existing.filter(i => i.id !== item.id);
    // Add to front
    const updated = [item, ...filtered].slice(0, 10); // Keep last 10
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recently viewed:', error);
  }
};

export const loadRecentlyViewed = (): RecentlyViewedItem[] => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};
