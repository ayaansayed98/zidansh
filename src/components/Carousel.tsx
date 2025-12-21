import { useEffect, useState } from 'react';
import { Pause, Play, ShoppingBag, Star, Heart } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
}

interface CarouselProps {
  addToFavorites?: (product: any) => void;
  isFavorite?: (productId: number) => boolean;
  onProductSelect?: (productId: number) => void;
}

function Carousel({ addToFavorites, isFavorite, onProductSelect }: CarouselProps) {
  const slides: Slide[] = [
    {
      id: 1, // Maps to product id 1
      title: 'Yellow, Grey & White Printed Kurta Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Yellow, grey and white printed kurta with trousers. A-line 2 piece set perfect for everyday elegance.',
      image: '/zidansh img/realimg/img1.jpg',
      price: '₹699',
      originalPrice: '₹1099',
      badge: 'BEST SELLER',
      rating: 4.5,
      reviews: 1234,
      features: ['A-line Cut', 'Comfort Fit', 'printed Design']
    },
    {
      id: 4, // Maps to product id 4
      title: 'Pink Floral Co-ord Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Pink floral co-ord set. Stylish and comfortable, perfect for casual outings or semi-formal events.',
      image: '/zidansh img/realimg/img4.jpg',
      price: '₹599',
      originalPrice: '₹999',
      badge: 'TRENDING',
      rating: 4.5,
      reviews: 856,
      features: ['Co-ord Set', 'Floral Pattern', 'Trendy Look']
    },
    {
      id: 8, // Maps to product id 8
      title: 'Jaipuri Cotton Biscuit 3-Piece Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Jaipuri cotton 3-piece set in biscuit color. Authentic cotton fabric with traditional charm.',
      image: '/zidansh img/realimg/img8.jpg',
      price: '₹679',
      originalPrice: '₹1099',
      badge: 'PREMIUM',
      rating: 4.7,
      reviews: 1678,
      features: ['Jaipuri Cotton', '3-Piece Set', 'Traditional']
    },
    {
      id: 14, // Maps to product id 14
      title: 'Off-White Khadi Cotton Embroidered Kurti',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Off-white/natural khadi cotton short kurti with intricate embroidery. Simple yet sophisticated.',
      image: '/zidansh img/realimg/img14.jpg',
      price: '₹399',
      originalPrice: '₹799',
      badge: 'EXCLUSIVE',
      rating: 4.5,
      reviews: 3421,
      features: ['Khadi Cotton', 'Embroidery', 'Short Kurti']
    },
    {
      id: 18, // Maps to product id 18
      title: 'Grey Cotton 3-Piece Suit Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: '3 piece grey cotton suit set. A versatile addition to your wardrobe for any occasion.',
      image: '/zidansh img/realimg/img18.jpg',
      price: '₹679',
      originalPrice: '₹1099',
      badge: 'DESIGNER',
      rating: 4.5,
      reviews: 678,
      features: ['Cotton Fabric', '3-Piece Suit', 'Elegant Grey']
    },
    {
      id: 23, // Maps to product id 23
      title: 'Purple Floral Co-ord Set',
      subtitle: 'ZIDANSH PREMIUM',
      description: 'Purple floral co-ord set from our Premium collection. Radiant and stylish for the modern look.',
      image: '/zidansh img/realimg/img23.jpg',
      price: '₹699',
      originalPrice: '₹1199',
      badge: 'LUXURY',
      rating: 4.4,
      reviews: 2345,
      features: ['Premium Collection', 'Floral Design', 'Co-ord Style']
    },
    {
      id: 16, // Maps to product id 16
      title: 'Floral Embroidered Cream & Maroon Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Floral embroidered cream/beige set with maroon print. A-line 2 piece set with a touch of class.',
      image: '/zidansh img/realimg/img16.jpg',
      price: '₹499',
      originalPrice: '₹999',
      badge: 'NEW ARRIVAL',
      rating: 4.7,
      reviews: 1567,
      features: ['Embroidered', 'A-line 2 Piece', 'Contrast Print']
    },
    {
      id: 21, // Maps to product id 21
      title: 'Yellow Floral Co-ord Set',
      subtitle: 'ZIDANSH COLLECTION',
      description: 'Yellow floral co-ord set. Bright and cheerful, perfect for sunny days and happy vibes.',
      image: '/zidansh img/realimg/img21.jpg',
      price: '₹699',
      originalPrice: '₹1199',
      badge: 'LIMITED',
      rating: 4.5,
      reviews: 987,
      features: ['Floral Print', 'Summer Ready', 'Co-ord Set']
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const prev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((i) => (i === 0 ? slides.length - 1 : i - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const next = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((i) => (i === slides.length - 1 ? 0 : i + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  // Autoplay: advance every 7s; pause when hovered or when paused via control
  useEffect(() => {
    if (hovered || !isPlaying) return;
    const id = window.setInterval(() => {
      next();
    }, 7000);
    return () => window.clearInterval(id);
  }, [hovered, isPlaying]);

  // Handle touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      prev();
    }
  };

  return (
    <section className="relative text-white overflow-hidden bg-gradient-to-r from-rose-600 to-pink-60 z-10"
      style={{ height: 'auto', position: 'relative', marginBottom: '0rem' }}>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6 mb-0">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          <div className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px]">
            {/* Slides */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                  ? 'opacity-100 translate-x-0 scale-100'
                  : index < currentSlide
                    ? 'opacity-0 -translate-x-full scale-95'
                    : 'opacity-0 translate-x-full scale-95'
                  }`}
              >
                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                    draggable={false}
                  />
                  {/* Multiple Gradient Overlays for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30" />
                </div>

                {/* Content Container */}
                <div className="relative h-full flex items-center pb-6">
                  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
                      {/* Left Content */}
                      <div className="space-y-3 sm:space-y-6 lg:space-y-8">
                        {/* Badge */}
                        {slide.badge && (
                          <div className="inline-flex items-center bg-gradient-to-r from-rose-600 to-pink-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider shadow-lg animate-pulse ml-2 sm:ml-4">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {slide.badge}
                          </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1 sm:space-y-3">
                          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight text-white">
                            {slide.title}
                          </h1>
                          <h2 className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light text-rose-300 tracking-wider">
                            {slide.subtitle}
                          </h2>
                        </div>

                        {/* Rating - Hidden on mobile, shown on larger screens */}
                        {slide.rating && (
                          <div className="hidden sm:flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(slide.rating!)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                    }`}
                                />
                              ))}
                              <span className="ml-2 text-base sm:text-lg font-semibold text-white">
                                {slide.rating}
                              </span>
                            </div>
                            <span className="text-gray-200 text-sm sm:text-base">
                              ({slide.reviews} reviews)
                            </span>
                          </div>
                        )}

                        {/* Description - Shorter on mobile */}
                        <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none">
                          {slide.description}
                        </p>

                        {/* Features - Hidden on mobile, shown on larger screens */}
                        {slide.features && (
                          <div className="hidden sm:flex flex-wrap gap-2 sm:gap-3">
                            {slide.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price & CTA */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-8 pt-2 sm:pt-4">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
                              {slide.price}
                            </div>
                            {slide.originalPrice && (
                              <div className="text-base sm:text-xl md:text-2xl text-gray-300 line-through">
                                {slide.originalPrice}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                if (onProductSelect) {
                                  onProductSelect(slide.id);
                                }
                              }}
                              className="group bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg transition-all duration-200 transform hover:-translate-y-1 active:translate-y-[4px] shadow-[0_6px_0_#9f1239] hover:shadow-[0_8px_0_#881337] active:shadow-none flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto min-h-[40px] sm:min-h-[44px]"
                            >
                              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                              <span className="text-xs sm:text-sm lg:text-base">Shop Now</span>
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping group-hover:animate-pulse"></div>
                            </button>

                            <button
                              onClick={() => {
                                if (addToFavorites) {
                                  addToFavorites(slide);
                                }
                              }}
                              className="p-2 sm:p-3 lg:p-4 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 group min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center shadow-md"
                            >
                              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors ${isFavorite && isFavorite(slide.id)
                                ? 'text-rose-600 fill-current'
                                : 'text-gray-500 group-hover:text-rose-600'
                                }`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Content - Product Preview */}
                      <div className="hidden lg:block max-w-xs mx-auto -mt-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-pink-200/30 rounded-3xl blur-xl" />
                          <div className="relative bg-white/30 backdrop-blur-sm border border-gray-200 rounded-2xl p-8">
                            <div className="aspect-[3/4.5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                              onClick={() => {
                                if (onProductSelect) {
                                  onProductSelect(slide.id);
                                }
                              }}>
                              <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                            <div className="mt-6 text-center">
                              <h3 className="text-2xl font-bold text-gray-800 mb-2">{slide.title}</h3>
                              <p className="text-rose-600 text-lg">{slide.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}



            {/* Play/Pause with Enhanced Styling */}
            <button
              aria-label={isPlaying ? 'Pause autoplay' : 'Play autoplay'}
              onClick={() => setIsPlaying((v) => !v)}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-14 sm:h-14 bg-white/30 hover:bg-white/40 backdrop-blur-md text-gray-700 rounded-full transition-all duration-300 hover:scale-110 border border-gray-300 flex items-center justify-center shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-6 sm:h-6" /> : <Play className="w-4 h-4 sm:w-6 sm:h-6" />}
            </button>

            {/* Enhanced Progress Bar */}
            <div className="absolute bottom-4 left-4 right-4 h-1 sm:h-2 bg-white/20 z-20">
              <div
                className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>

            {/* Slide Counter */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/30 backdrop-blur-sm border border-gray-300 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 z-20">
              <span className="text-white font-mono text-[10px] sm:text-xs">
                {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Enhanced Slide Indicators - Hidden on mobile, shown on larger screens */}
            <div className="hidden sm:flex absolute bottom-12 left-1/2 -translate-x-1/2 gap-2 sm:gap-4 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  disabled={isTransitioning}
                  className={`relative transition-all duration-300 disabled:cursor-not-allowed ${index === currentSlide
                    ? 'w-8 h-3 sm:w-12 sm:h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg'
                    : 'w-3 h-3 sm:w-4 sm:h-4 bg-white/40 hover:bg-white/60 rounded-full'
                    }`}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}

export default Carousel;
