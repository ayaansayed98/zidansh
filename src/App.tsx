import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { userService } from './lib/database';
import Header from './components/Header';
import Carousel from './components/Carousel';
import FeaturedProducts, { products as featuredProducts } from './components/FeaturedProducts';
import Categories from './components/Categories';
import Footer from './components/Footer';
import { KeepShopping } from './components/KeepShopping';
import ProductDetail from './components/ProductDetail';
import CheckoutForm from './components/CheckoutForm';
import CartManager from './components/CartManager';
import Chatbot from './components/Chatbot';
import WhatsAppWidget from './components/WhatsAppWidget';
import ShippingReturns from './components/ShippingReturns';
import AboutUs from './components/AboutUs';
import Profile from './components/Profile';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { SignInModal } from './components/SignInModal';
import { SignUpModal } from './components/SignUpModal';
import { loadCartItems, loadFavorites, saveCartItems, saveFavorites } from './lib/storage';
import { Product, ProductVariation } from './types/product';
import { CartItem as StorageCartItem } from './lib/storage';
import { analyticsService, generateSessionId } from './lib/analytics';
import LoadingScreen from './components/LoadingScreen';
import PaymentStatus from './components/PaymentStatus';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<StorageCartItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [highlightedProduct] = useState<number | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const products = featuredProducts;

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category === null) {
      setShowAllProducts(true);
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Load cart items and favorites from localStorage on mount
  useEffect(() => {
    const loadedCartItems = loadCartItems();
    const loadedFavorites = loadFavorites();
    setCartItems(loadedCartItems);
    setFavorites(loadedFavorites);
  }, []);

  // Re-sync cart items when route changes (fix for cart not visible after returning from product detail)
  useEffect(() => {
    const loadedCartItems = loadCartItems();
    const loadedFavorites = loadFavorites();
    setCartItems(loadedCartItems);
    setFavorites(loadedFavorites);

    // Track page view for analytics
    const sessionId = generateSessionId();
    analyticsService.trackPageView(
      sessionId,
      window.location.pathname,
      navigator.userAgent,
      document.referrer
    );
  }, [location.pathname]);

  const [userProfile, setUserProfile] = useState<any>(null);

  // Handle Supabase Auth state changes
  useEffect(() => {
    // Check key for initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser?.email) {
        const profile = await userService.getUserByEmail(authUser.email);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    // Check for errors in URL (e.g. from Google Auth redirect)
    const params = new URLSearchParams(window.location.hash.substring(1)); // Supabase returns hash fragments often
    const errorDescription = params.get('error_description');
    if (errorDescription) {
      console.error('Auth Error:', errorDescription);
      alert(`Authentication Error: ${errorDescription.replace(/\+/g, ' ')}`);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        // Check if user exists in database
        const email = authUser.email;
        if (email) {
          try {
            let existingUser = await userService.getUserByEmail(email);

            if (!existingUser) {
              // Create new user from Google profile
              const fullName = authUser.user_metadata.full_name || '';
              const username = fullName.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000);

              existingUser = await userService.create({
                username,
                email_address: email,
                // Only provide required fields, others are now optional
              });

              console.log('Created new user from Google Auth:', email);
            } else {
              // Update last signin
              await userService.updateUserSignin(existingUser.id);
            }
            setUserProfile(existingUser);
          } catch (error) {
            console.error('Error syncing Google user:', error);
            // More detailed logging for debugging
            console.log('Detailed Error:', JSON.stringify(error, null, 2));
            alert('Failed to create user account. Please contact support.');
          }
        }

        // Close modals if open
        setIsSignInOpen(false);
        setIsSignUpOpen(false);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wrapper functions that save to localStorage
  const setCartItemsWithStorage = (newCartItems: any[] | ((prev: any[]) => any[])) => {
    const updatedCart = typeof newCartItems === 'function' ? newCartItems(cartItems) : newCartItems;
    setCartItems(updatedCart);
    saveCartItems(updatedCart);
  };

  const setFavoritesWithStorage = (newFavorites: any[] | ((prev: any[]) => any[])) => {
    const updatedFavorites = typeof newFavorites === 'function' ? newFavorites(favorites) : newFavorites;
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const handleOrderComplete = (orderDetails: any) => {
    console.log('Order completed:', orderDetails);
    // Handle order completion logic
  };

  const removeFromCart = (itemToRemove: any) => {
    setCartItemsWithStorage(prev => prev.filter(item => {
      // Handle both regular cart items and grouped items from order summary
      const itemId = itemToRemove.cartItemId || itemToRemove.id;
      const itemSize = itemToRemove.size;

      const cartItemId = item.cartItemId || item.id;
      const cartItemSize = item.size;

      return !(cartItemId === itemId && cartItemSize === itemSize);
    }));
  };

  const addToCart = (product: Product, variation: ProductVariation, quantity: number = 1) => {
    const cartItemId = `${product.id}-${variation.sku}-${Date.now()}`;

    // Ensure we have a valid image path
    let imagePath = '';
    if (variation.image) {
      // If variation has an image, use it directly
      imagePath = variation.image;
    } else if (product.images && product.images.length > 0) {
      // Use the first product image if available
      imagePath = product.images[0];
    }

    // Format the image path to be consistent with how it's used in the app
    if (imagePath && !imagePath.startsWith('http') && !imagePath.includes('/')) {
      // If it's just a filename, prepend the correct path
      imagePath = `/zidansh img/realimg/${imagePath}`;
    }

    const newCartItem: StorageCartItem = {
      cartItemId,
      productId: product.id,
      id: product.id,
      name: product.name,
      brand: product.brand,
      cloth_type: product.cloth_type,
      price: variation.price,
      image: imagePath,
      quantity,
      size: variation.sku.split('-')[1] || variation.sku, // Extract size from SKU (e.g., "PRD001-S" -> "S")
      addedAt: new Date().toISOString()
    };
    setCartItemsWithStorage(prev => [...prev, newCartItem]);
  };

  // Remove unused function - will be handled by CartManager component
  // const removeFromCart = (itemToRemove: any) => {
  //   setCartItemsWithStorage(prev => prev.filter(item =>
  //     !(item.id === itemToRemove.id && item.size === itemToRemove.size)
  //   ));
  // };

  const addToFavorites = (product: any) => {
    setFavoritesWithStorage(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: number) => {
    return favorites.some(item => item.id === productId);
  };

  const navigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Cart opening logic is now handled by the isCartOpen state

  // Handle initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for branding
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Debug log to verify products
  console.log('AppContent - products loaded:', products.length);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        user={user}
        userProfile={userProfile}
        cartCount={cartItems.length}
        cartItems={cartItems}
        favorites={favorites}
        products={products}
        onCartClick={openCart}
        onSignInClick={() => setIsSignInOpen(true)}
        onSignUpClick={() => setIsSignUpOpen(true)}
        onSignOutClick={handleSignOut}
        onCategorySelect={handleCategorySelect}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Carousel
                addToFavorites={addToFavorites}
                isFavorite={isFavorite}
                onProductSelect={navigateToProduct}
              />
              <KeepShopping />
              <Categories
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategorySelect}
              />
              <FeaturedProducts
                addToFavorites={addToFavorites}
                isFavorite={isFavorite}
                highlightedProduct={highlightedProduct}
                showAll={showAllProducts}
                setShowAll={setShowAllProducts}
                navigateToProduct={navigateToProduct}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategorySelect}
              />
            </>
          } />
          <Route path="/product/:id" element={
            <ProductDetail
              products={products}
              addToCart={addToCart}
              addToFavorites={addToFavorites}
              isFavorite={isFavorite}
              user={user}
              userProfile={userProfile}
            />
          } />

          <Route path="/checkout" element={
            <CheckoutForm
              cartItems={cartItems.map(item => ({
                id: item.cartItemId,
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                image: item.image
              }))}
              onOrderComplete={handleOrderComplete}
              onClose={() => navigate('/')}
              onRemoveItem={removeFromCart}
              navigate={(path) => navigate(path)}
            />
          } />

          <Route path="/shipping-returns" element={
            <ShippingReturns />
          } />

          <Route path="/about" element={
            <AboutUs />
          } />

          <Route path="/profile" element={
            <Profile user={user} userProfile={userProfile} onSignOut={handleSignOut} />
          } />

          <Route path="/analytics" element={
            <AnalyticsDashboard />
          } />
          <Route path="/orders" element={
            <Navigate to="/profile" replace />
          } />

          <Route path="/payment/success" element={
            <PaymentStatus />
          } />
          <Route path="/payment/failure" element={
            <PaymentStatus />
          } />
        </Routes>
      </main>

      <CartManager
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        setCartItems={setCartItemsWithStorage}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <Chatbot
        products={products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.basePrice,
          image: product.images?.[0] || '',
          category: 'clothing'
        }))}
        onAddToCart={(product, selectedSize) => {
          const fullProduct = products.find(p => p.id === product.id);
          if (fullProduct) {
            const variation = fullProduct.variations.find(v => v.sku === selectedSize) || fullProduct.variations[0];
            addToCart(fullProduct, variation, 1);
          }
        }}
        onAddToFavorites={(product) => {
          const fullProduct = products.find(p => p.id === product.id);
          if (fullProduct) {
            addToFavorites(fullProduct);
          }
        }}
        onProductSelect={navigateToProduct}
        onOpenCart={openCart}
      />
      <Footer />
      <WhatsAppWidget />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignUpClick={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignInClick={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
