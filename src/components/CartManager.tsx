import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CartItem {
  id: number;
  cartItemId: string;
  name: string;
  brand: string;
  cloth_type: string;
  price: number;
  quantity: number;
  size?: string;
  image: string; // Added missing image property
}

interface CartManagerProps {
  isOpen?: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  onProceedToCheckout?: () => void;
}

const CartManager: React.FC<CartManagerProps> = ({
  onClose,
  cartItems: initialCartItems,
  setCartItems,
  isOpen = true,
  onProceedToCheckout
}) => {
  const [localCartItems, setLocalCartItems] = useState<CartItem[]>(initialCartItems);
  const checkoutBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalCartItems(initialCartItems);
  }, [initialCartItems]);

  const handleRemoveItem = (cartItemId: string) => {
    const updatedItems = localCartItems.filter(item => item.cartItemId !== cartItemId);
    setLocalCartItems(updatedItems);
    setCartItems(updatedItems);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedItems = localCartItems.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    setLocalCartItems(updatedItems);
    setCartItems(updatedItems);
  };

  const totalAmount = localCartItems.reduce(
    (total, item) => total + (item.price * item.quantity), 0
  );

  // Cleanup event listeners
  useEffect(() => {
    const btn = checkoutBtnRef.current;
    if (!btn) return;

    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // Handle checkout logic here
      return false;
    };

    // Use capture phase to ensure we catch the event first
    btn.addEventListener('click', handleClick, true);
    btn.addEventListener('touchend', handleClick, true);

    return () => {
      btn.removeEventListener('click', handleClick, true);
      btn.removeEventListener('touchend', handleClick, true);
    };
  }, []);

  // Get the correct image path for the cart item
  const getItemImage = (item: CartItem) => {
    // If no image is provided, use a default fallback
    if (!item.image) return '/images/combo 275.jpg';
    
    // If the image is a full URL, use it as is
    if (item.image.startsWith('http')) {
      return item.image;
    }
    
    // If the image already contains a path, use it directly
    if (item.image.includes('/')) {
      return item.image.startsWith('/') ? item.image : `/${item.image}`;
    }
    
    // Handle different image naming patterns
    if (item.image.startsWith('img') || item.image.endsWith('.jpg') || item.image.endsWith('.png')) {
      // Remove any path that might be in the image name
      const imageName = item.image.split('/').pop() || item.image;
      return `/zidansh img/realimg/${imageName}`;
    }
    
    // Fallback to default image if no valid image is found
    return '/images/combo 275.jpg';
  };

  // Handle checkout button click
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleProceedToCheckout(e);
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not on the cart content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle checkout navigation
  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[95] overflow-hidden" 
      onClick={handleOverlayClick}
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div 
              className="h-full flex flex-col bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {localCartItems.map((item) => (
                        <li key={item.cartItemId} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <img
                              src={getItemImage(item)}
                              alt={item.name}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p>₹{item.price.toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                              <p className="mt-1 text-sm text-gray-500">{item.cloth_type}</p>
                              {item.size && (
                                <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                              )}
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newQuantity = item.quantity - 1;
                                    if (newQuantity > 0) {
                                      updateQuantity(item.cartItemId, newQuantity);
                                    } else {
                                      handleRemoveItem(item.cartItemId);
                                    }
                                  }}
                                  className="text-gray-400 hover:text-gray-500 mr-2"
                                >
                                  <span className="sr-only">Decrease quantity</span>
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(item.cartItemId, item.quantity + 1);
                                  }}
                                  className="text-gray-400 hover:text-gray-500 ml-2"
                                >
                                  <span className="sr-only">Increase quantity</span>
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveItem(item.cartItemId);
                                }}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{totalAmount.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <button
                    ref={checkoutBtnRef}
                    type="button"
                    disabled={localCartItems.length === 0}
                    className={`w-full py-3 rounded-md transition-colors flex items-center justify-center gap-2 ${
                      localCartItems.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white active:bg-green-800'
                    }`}
                    onClick={handleCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartManager;
