import { ShoppingBag, Heart, Menu, X, Search, User, LogOut, Package, UserCircle, ChevronDown, Mail, MessageCircle, Instagram } from 'lucide-react';
const img1 = '/zidansh img/realimg/img1.jpg';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { buttonTrackingService } from '../lib/buttonTracking';

interface HeaderProps {
  cartCount?: number;
  cartItems?: any[];
  onCartClick?: () => void;
  favorites: any[];
  products?: any[];
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  user?: any;
  userProfile?: any;
  onSignOutClick?: () => void;
  onCategorySelect?: (category: string) => void;
}

const CATEGORIES = [
  'Kurtis',
  'Co-ord Sets',
  'A line 2 piece sets',
  '3 piece cotton sets',
  'Plus size 3 piece cotton sets'
];

function Header({ cartCount: _cartCount, onCartClick: _onCartClick, favorites, products = [], onSignInClick, onSignUpClick, user, userProfile, onSignOutClick, onCategorySelect }: HeaderProps) {
  const navigate = useNavigate();
  // State for UI elements
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);


  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);

  // Refs
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const [badgeBump, setBadgeBump] = useState(false);
  const prevFavCountRef = useRef<number>(favorites.length);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });

    const handleClickOutside = (event: MouseEvent) => {
      // Close search results
      const target = event.target as Node;
      if (
        mobileSearchRef.current && !mobileSearchRef.current.contains(target) &&
        desktopSearchRef.current && !desktopSearchRef.current.contains(target)
      ) {
        setShowSearch(false);
      }

      // Close account dropdown
      const accountButtons = document.querySelectorAll('[data-account-button]');
      const accountDropdowns = document.querySelectorAll('[data-account-dropdown]');

      let clickedInsideAccount = false;
      accountButtons.forEach(btn => {
        if (btn.contains(event.target as Node)) clickedInsideAccount = true;
      });
      accountDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target as Node)) clickedInsideAccount = true;
      });

      if (!clickedInsideAccount) {
        setShowAccount(false);
      }

      // Close favorites dropdown
      const favoritesButtons = document.querySelectorAll('[data-favorites-button]');
      const favoritesDropdowns = document.querySelectorAll('[data-favorites-dropdown]');

      let clickedInsideFavorites = false;
      favoritesButtons.forEach(btn => {
        if (btn.contains(event.target as Node)) clickedInsideFavorites = true;
      });
      favoritesDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target as Node)) clickedInsideFavorites = true;
      });

      if (!clickedInsideFavorites) {
        setShowFavorites(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // initialize scrolled state
    setScrolled(window.scrollY > 8);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', () => setScrolled(false));
    };
  }, []);

  // Animate badge when favorites count changes
  useEffect(() => {
    if (prevFavCountRef.current !== favorites.length) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 420);
      prevFavCountRef.current = favorites.length;
      return () => clearTimeout(t);
    }
    prevFavCountRef.current = favorites.length;
  }, [favorites.length]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim() === '') {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    const q = query.trim().toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
    );
    setSearchResults(results);
    setShowSearch(true);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Handle cart click
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (buttonTrackingService?.trackButtonClick) {
        buttonTrackingService.trackButtonClick({
          button_name: 'Cart Button',
          button_location: 'header',
          page_url: window.location.pathname
        }).catch(error => {
          console.error('Error tracking button click:', error);
        });
      }
    } catch (error) {
      console.error('Error in handleCartClick:', error);
    }

    if (_onCartClick) {
      _onCartClick();
    }
  };

  // Helper to get robust image path
  const getProductImage = (product: any) => {
    // 1. Check for direct image property
    if (product.image) {
      if (product.image.startsWith('http') || product.image.startsWith('/')) {
        return product.image;
      }
      return `/zidansh img/realimg/${product.image}`;
    }

    // 2. Check for images array
    if (product.images && product.images.length > 0) {
      const firstImg = product.images[0];
      if (firstImg.startsWith('http') || firstImg.startsWith('/')) {
        return firstImg;
      }
      return `/zidansh img/realimg/${firstImg}`;
    }

    // 3. Fallback
    return `/zidansh img/realimg/img${product.id}.jpg`;
  };

  return (
    <header className={`bg-pink-200 sticky top-0 z-[90] flex flex-col transition-shadow ${scrolled ? 'shadow-xl' : 'shadow-sm'}`}>
      {/* Moving offer messages bar */}
      <div className="w-full flex-shrink-0 bg-[#F5E5D5] text-purple-800 text-xs sm:text-sm py-0.5 overflow-hidden z-[95]">
        <div className="w-full px-4 marquee">
          <div className="marquee-content flex items-center space-x-8 font-semibold">
            <span>🔥 Mega Sale: upto 50% OFF on selected Kurtis!</span>
            <span>🚚 Free Shipping on all orders above ₹999</span>
            <span>✨ New Arrivals: Premium Combos starting at just ₹349</span>
            <span>🕒 Limited Time Offer: Extra 5% OFF with code ZIDANSH5</span>
          </div>
        </div>
      </div>


      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-pink-200">
        <div className="flex justify-between items-center py-1 sm:py-2 lg:py-3">
          {/* Mobile: Logo Left, Icons Right */}
          <div className="lg:hidden flex items-center justify-between w-full">
            {/* Logo (Extreme Left) */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Icons & Menu (Extreme Right) */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="text-gray-700 hover:text-pink-600 p-1 relative"
                data-favorites-button
              >
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Mobile Favorites Dropdown */}
              {showFavorites && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-md z-50 border border-gray-200" data-favorites-dropdown>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-700 text-sm">Favorites</h4>
                      <button onClick={() => setShowFavorites(false)}><X className="w-4 h-4" /></button>
                    </div>
                    {favorites.length === 0 ? (
                      <div className="text-gray-500 text-xs text-center py-2">No favorites yet</div>
                    ) : (
                      <ul className="max-h-60 overflow-y-auto">
                        {favorites.map((product: any) => (
                          <li key={product.id} className="flex items-center gap-2 mb-2 p-1 hover:bg-gray-50 rounded">
                            <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                              <img
                                src={getProductImage(product)}
                                alt={product.title || product.name}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = img1;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0" onClick={() => {
                              setShowFavorites(false);
                              navigate(`/product/${product.id}`);
                            }}>
                              <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">₹{product.price || product.basePrice}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <button
                className="text-gray-700 hover:text-gray-900 p-1 relative"
                onClick={handleCartClick}
                data-cart-button
              >
                <ShoppingBag className="h-6 w-6" />
                {_cartCount && _cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {_cartCount}
                  </span>
                )}
              </button>

              <button
                className="text-gray-700 hover:text-gray-900 p-1"
                onClick={toggleMobileMenu}
                aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center w-full py-3">
            {/* Logo */}
            <div className="flex-shrink-0 mr-4">
              <Logo />
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-6 ml-6">
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium py-4">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:-rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] border border-pink-100 transform translate-y-2 group-hover:translate-y-0">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => {
                        navigate('/');
                        if (onCategorySelect) {
                          onCategorySelect(category);
                          // Small timeout to allow navigation to complete if needed, though usually state update is enough
                          setTimeout(() => {
                            const element = document.getElementById('featured-products');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Us Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium py-4">
                  <span>Contact Us</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:-rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] border border-pink-100 transform translate-y-2 group-hover:translate-y-0">
                  <a
                    href="https://wa.me/918454902834"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block">WhatsApp</span>
                      <span className="text-xs text-gray-500">Chat with us</span>
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/zidanshenterprise?igsh=MTc5cGIwcW01OHhoeg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mr-3 text-pink-600">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block">Instagram</span>
                      <span className="text-xs text-gray-500">DM us</span>
                    </div>
                  </a>
                  <button
                    onClick={() => {
                      const email = 'support@zidansh.com';
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;
                      window.open(gmailUrl, '_blank');
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block">Email</span>
                      <span className="text-xs text-gray-500">Send us a mail</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* About Us Link */}
              <Link
                to="/about"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                About Us
              </Link>
            </div>

            {/* Desktop Icons - Pushed to right */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Search */}
              <div className="relative" ref={desktopSearchRef}>
                <form className="relative flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm bg-white" onSubmit={e => { e.preventDefault(); handleSearch(searchQuery); }}>
                  <span className="absolute left-3 text-gray-400"><Search className="w-4 h-4" /></span>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="flex-1 pl-10 pr-8 py-2 text-sm md:text-base focus:outline-none"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && handleSearch(searchQuery)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearch(false); }}
                      className="absolute right-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                {showSearch && (
                  <div className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-md z-50 border border-gray-200 max-h-72 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="text-gray-500 text-xs py-4 text-center">No products found.</div>
                    ) : (
                      <ul>
                        {searchResults.map((product: any) => (
                          <li key={product.id}>
                            <button
                              className="flex items-center w-full px-3 py-2 hover:bg-pink-50 space-x-2"
                              onClick={() => {
                                navigate(`/product/${product.id}`);
                                setShowSearch(false);
                                setSearchResults([]);
                              }}
                            >
                              {product.image && (
                                <img src={`/zidansh img/realimg/${product.image}`} alt={product.name} className="h-8 w-8 object-contain rounded" />
                              )}
                              <span className="text-gray-700 text-sm text-left truncate" style={{ maxWidth: '150px' }}>{product.name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites */}
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 hover:bg-pink-500 p-2 rounded transition-colors relative"
                  onClick={() => {
                    buttonTrackingService.trackButtonClick({
                      button_name: 'Favorites Button',
                      button_location: 'header',
                      page_url: window.location.pathname
                    });
                    setShowFavorites(!showFavorites);
                  }}
                  data-favorites-button
                >
                  <Heart className="h-5 w-5" />
                  {favorites.length > 0 && (
                    <span className={`absolute -top-2 -right-2 bg-red-600 text-white text-[13px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white z-10 ${badgeBump ? 'badge-bump' : ''}`}>
                      {favorites.length}
                    </span>
                  )}
                </button>
                {showFavorites && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white shadow-lg rounded-md z-[150] border border-gray-200 max-h-80 overflow-y-auto" data-favorites-dropdown>
                    <div className="p-3">
                      <h4 className="font-bold mb-2 text-gray-700 text-sm">Your Favorites</h4>
                      {favorites.length === 0 ? (
                        <div className="text-gray-500 text-xs py-4 text-center">No favorites selected</div>
                      ) : (
                        <ul>
                          {favorites.map((product: any) => (
                            <li
                              key={product.id}
                              className="group flex items-center mb-2 last:mb-0 space-x-2 p-2 hover:bg-pink-600 rounded transition-colors"
                            >
                              <button
                                type="button"
                                className="flex items-center space-x-2 w-full text-left"
                                onClick={() => {
                                  setShowFavorites(false);
                                  navigate(`/product/${product.id}`);
                                }}
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
                                  <img
                                    src={getProductImage(product)}
                                    alt={product.name || 'Product image'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = img1;
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-gray-700 group-hover:text-white font-medium truncate">
                                  {product.title || product.name || `Product ${product.id}`}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 hover:bg-pink-500 p-2 rounded transition-colors relative"
                  onClick={handleCartClick}
                  data-cart-button
                >
                  <ShoppingBag className="h-5 w-5" />
                  {_cartCount && _cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[13px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white z-10">
                      {_cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* My Account */}
              <div className="relative">
                <button
                  className="text-gray-700 hover:text-gray-900 hover:bg-pink-500 p-2 rounded transition-colors flex items-center space-x-1"
                  onClick={() => {
                    buttonTrackingService.trackButtonClick({
                      button_name: 'My Account Button',
                      button_location: 'header',
                      page_url: window.location.pathname
                    });
                    setShowAccount(!showAccount);
                  }}
                  data-account-button
                >
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs font-bold">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden md:inline text-sm font-medium">
                        {user.user_metadata?.full_name?.split(' ')[0] || userProfile?.username || 'Account'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <User className="h-5 w-5" />
                      <span className="hidden md:inline text-sm">My Account</span>
                    </>
                  )}
                </button>
                {showAccount && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50 border border-gray-200" data-account-dropdown>
                    {user ? (
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100 bg-pink-50/50">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.user_metadata?.full_name || userProfile?.username || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>

                          {/* Extended Details */}
                          {userProfile && (
                            <div className="mt-2 pt-2 border-t border-gray-200/60 space-y-1">
                              {userProfile.phone_number && (
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <span>📱</span> {userProfile.phone_number}
                                </p>
                              )}
                              {userProfile.username && userProfile.username !== user.user_metadata?.full_name && (
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <span>👤</span> @{userProfile.username}
                                </p>
                              )}
                              {userProfile.created_at && (
                                <p className="text-[10px] text-gray-400 mt-1">
                                  Member since {new Date(userProfile.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center space-x-2"
                          onClick={() => setShowAccount(false)}
                        >
                          <UserCircle className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 flex items-center space-x-2"
                          onClick={() => setShowAccount(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            onClick={() => {
                              setShowAccount(false);
                              if (onSignOutClick) onSignOutClick();
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white hover:shadow-lg"
                          onClick={() => {
                            setShowAccount(false);
                            if (onSignInClick) onSignInClick();
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white hover:shadow-lg"
                          onClick={() => {
                            setShowAccount(false);
                            if (onSignUpClick) onSignUpClick();
                          }}
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="lg:hidden flex justify-center py-2 w-full px-4">
          <div className="w-full relative" ref={mobileSearchRef}>
            <form className="relative flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm bg-white" onSubmit={e => { e.preventDefault(); handleSearch(searchQuery); }}>
              <span className="absolute left-3 text-gray-400"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 pl-10 pr-8 py-2 text-sm focus:outline-none"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => searchQuery && handleSearch(searchQuery)}
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearch(false); }}
                  className="absolute right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            {showSearch && (
              <div className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-md z-50 border border-gray-200 max-h-72 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-gray-500 text-xs py-4 text-center">No products found.</div>
                ) : (
                  <ul>
                    {searchResults.map((product: any) => (
                      <li key={product.id}>
                        <button
                          className="flex items-center w-full px-3 py-2 hover:bg-pink-50 space-x-2"
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setShowSearch(false);
                            setSearchResults([]);
                          }}
                        >
                          {product.image && (
                            <img src={`/zidansh img/realimg/${product.image}`} alt={product.name} className="h-8 w-8 object-contain rounded" />
                          )}
                          <span className="text-gray-700 text-sm text-left truncate" style={{ maxWidth: '150px' }}>{product.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full top-full left-0 z-50">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/shipping-returns"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Shipping & Returns
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 +91 8454902834</p>
                <p>📧 support@zidansh.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
