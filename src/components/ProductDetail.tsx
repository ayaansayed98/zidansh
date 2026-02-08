import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ChevronLeft, ChevronRight, AlertTriangle, Plus, Minus, Upload, X } from 'lucide-react';
import { analyticsService, generateSessionId } from '../lib/analytics';
import { reviewsService } from '../lib/reviews';
import { Product, ProductVariation, getStockStatus, isVariationInStock } from '../types/product';
import { User as UserProfile } from '../types/user';
import { User } from '@supabase/supabase-js';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product, variation: ProductVariation, quantity: number) => void;
  addToFavorites: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  user?: User | null;
  userProfile?: UserProfile | null;
}

import { saveRecentlyViewed } from '../lib/storage';

function ProductDetail({ products, addToCart, addToFavorites, isFavorite, user, userProfile }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewDescription, setReviewDescription] = useState<string>('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingReviews, setExistingReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedProductImage, setSelectedProductImage] = useState<string | null>(null);
  const [isProductImageModalOpen, setIsProductImageModalOpen] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const baseUrl = import.meta.env.BASE_URL || '';

  const product = products.find(p => p.id === parseInt(id || '0'));

  // Save to recently viewed
  useEffect(() => {
    if (product) {
      saveRecentlyViewed({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.basePrice,
        viewedAt: Date.now()
      });
    }
  }, [product]);

  const [inventory, setInventory] = useState<Record<string, { stock: number; isActive: boolean }>>({});

  // Fetch live inventory for this product
  useEffect(() => {
    if (!product) return;

    const fetchInventory = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      // Fetch all variations for this product
      // Note: We select by product_id if possible, or we can just fetch all (less efficient but matches previous logic if product_id isn't indexed or reliable)
      // Actually our table DOES have product_id.
      const url = `${supabaseUrl}/rest/v1/product_variations?product_id=eq.${product.id}&select=variation_id,stock,is_active`;

      try {
        const response = await fetch(url, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        const inventoryMap: Record<string, { stock: number; isActive: boolean }> = {};

        data.forEach((item: any) => {
          inventoryMap[item.variation_id] = {
            stock: item.stock,
            isActive: item.is_active
          };
        });
        setInventory(inventoryMap);

      } catch (err) {
        console.error('Inventory sync failed', err);
      }
    };

    fetchInventory();
  }, [product]);

  // Merge live inventory into product
  const currentProduct = useMemo(() => product ? {
    ...product,
    variations: product.variations.map(variation => {
      const liveData = inventory[variation.id];
      return {
        ...variation,
        stock: liveData ? liveData.stock : variation.stock,
        isActive: liveData ? liveData.isActive : variation.isActive
      };
    })
  } : undefined, [product, inventory]);

  const [configError, setConfigError] = useState<string | null>(null);

  // Fetch existing reviews when component mounts
  useEffect(() => {
    // Check Supabase config
    const sbUrl = import.meta.env.VITE_SUPABASE_URL;
    const sbKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!sbUrl || !sbKey) {
      const msg = 'Supabase environment variables are missing! Please check your .env file and RESTART the dev server (Ctrl+C, then npm run dev).';
      console.error(msg);
      setConfigError(msg);
    } else {
      console.log('ProductDetail: Supabase URL configured as', sbUrl.replace(/https:\/\/(.*)\.supabase\.co/, 'https://***.supabase.co'));
    }

    if (currentProduct?.id) {
      fetchReviews(currentProduct.id);
    }
  }, [currentProduct?.id]);

  const fetchReviews = async (productId: number) => {
    try {
      const [reviews, stats] = await Promise.all([
        reviewsService.getProductReviews(productId),
        reviewsService.getProductReviewStats(productId)
      ]);

      setExistingReviews(reviews);
      setReviewStats(stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            Looking for product ID: {id} (parsed: {parseInt(id || '0')})
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const productImages = [...(currentProduct.images?.filter(Boolean) || [])];

  const defaultImage = '/images/placeholder-product.jpg';

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return defaultImage;
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    return `${baseUrl}zidansh img/realimg/${imagePath}`;
  };

  const similarProducts = products
    .filter(p =>
      p.brand === currentProduct.brand &&
      Math.abs(p.basePrice - currentProduct.basePrice) <= 200 &&
      p.id !== currentProduct.id
    )
    .slice(0, 4);

  const getSessionId = () => {
    let sessionId = localStorage.getItem('userSession');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('userSession', sessionId);
    }
    return sessionId;
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);
  };

  const findMatchingVariation = (attributes: Record<string, string>) => {
    return currentProduct?.variations.find(variation => {
      return Object.entries(attributes).every(([key, value]) =>
        variation.attributes[key] === value
      );
    });
  };

  useEffect(() => {
    if (currentProduct && Object.keys(selectedAttributes).length > 0) {
      const variation = findMatchingVariation(selectedAttributes);
      setSelectedVariation(variation || null);
      // Reset quantity when variation changes
      setQuantity(1);
    } else {
      setSelectedVariation(null);
    }
  }, [selectedAttributes, currentProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert('Please select product options');
      return;
    }
    if (!isVariationInStock(selectedVariation)) {
      alert('This variation is out of stock');
      return;
    }

    const sessionId = getSessionId();
    if (analyticsService) {
      analyticsService.trackInteraction({
        product_name: currentProduct.name,
        product_brand: currentProduct.brand || '',
        product_price: selectedVariation.price,
        interaction_type: 'cart_add',
        user_session: sessionId
      });

      analyticsService.addToCart({
        product_name: currentProduct.name,
        product_brand: currentProduct.brand || '',
        product_price: selectedVariation.price,
        quantity: quantity,
        user_session: sessionId
      });
    }

    addToCart(currentProduct, selectedVariation, quantity);
    alert(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart successfully!`);
    navigate('/');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Review form handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size (max 2MB per image)
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      if (!isValidSize) {
        alert(`Image ${file.name} is too large. Max size is 2MB.`);
      }
      return isValidSize;
    });

    const newImages = [...reviewImages, ...validFiles].slice(0, 4); // Limit to 4 images

    setReviewImages(newImages);

    // Create previews for new images
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews].slice(0, 4));
  };

  const removeImage = (index: number) => {
    const newImages = reviewImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setReviewImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleReviewSubmit = async () => {
    if (!currentProduct) return;

    // Validation
    if (reviewRating === 0) {
      alert('Please select a star rating.');
      return;
    }
    if (!reviewTitle.trim()) {
      alert('Please enter a review title.');
      return;
    }
    if (!reviewDescription.trim()) {
      alert('Please enter a review description.');
      return;
    }

    console.log('Submitting review for product:', currentProduct.id, {
      rating: reviewRating,
      title: reviewTitle,
      images: reviewImages.length
    });

    try {
      // Prepare review data
      const customerName = userProfile?.username || user?.user_metadata?.full_name || 'Anonymous Customer';

      const reviewData = {
        product_id: currentProduct.id,
        customer_name: customerName,
        rating: reviewRating,
        title: reviewTitle,
        description: reviewDescription,
        images: reviewImages
      };

      // Submit review to database
      const result = await reviewsService.submitReview(reviewData);
      console.log('Submission result:', result);

      if (result.success) {
        // Reset form
        setReviewRating(0);
        setReviewTitle('');
        setReviewDescription('');
        setReviewImages([]);
        setImagePreviews([]);

        // Refresh reviews to show the new one
        console.log('Fetching updated reviews...');
        await fetchReviews(currentProduct.id);

        // Show success message
        alert('Thank you for your review! It has been submitted successfully.');
      } else {
        // Show error message
        console.error('Submission failed:', result.error);
        alert(`Failed to submit review: ${result.error}`);
      }
    } catch (error) {
      console.error('Unexpected error in handleReviewSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const openProductImageModal = (imageSrc: string) => {
    setSelectedProductImage(imageSrc);
    setIsProductImageModalOpen(true);
  };

  const closeProductImageModal = () => {
    setSelectedProductImage(null);
    setIsProductImageModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {configError && (
        <div className="bg-red-600 text-white px-4 py-3 text-center font-bold">
          CRITICAL ERROR: {configError}
        </div>
      )}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Navigating back to home');
              navigate('/');
            }}
            className="flex items-center text-gray-600 hover:text-gray-900 z-10 relative" // Added z-10 and relative
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative w-full h-96 bg-white rounded-lg overflow-hidden">
              <img
                src={getImageUrl(productImages[currentImageIndex])}
                alt={currentProduct.name}
                className="w-full h-full object-contain cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => openProductImageModal(getImageUrl(productImages[currentImageIndex]))}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      openProductImageModal(getImageUrl(image));
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}


            {/* Product Description */}
            {currentProduct.description && (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wider">Product Description</h3>
                <div
                  className={`prose prose-sm text-gray-600 leading-relaxed ${!showFullDescription ? 'line-clamp-2' : ''}`}
                  dangerouslySetInnerHTML={{ __html: currentProduct.description.replace(/\n/g, '<br />') }}
                />
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium focus:outline-none"
                >
                  {showFullDescription ? 'See Less' : 'See More'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">{currentProduct.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{currentProduct.name}</h1>

              <div className="flex items-center space-x-2 mt-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-lg font-semibold text-gray-700">
                    {reviewStats ? reviewStats.averageRating.toFixed(1) : currentProduct.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({reviewStats ? reviewStats.totalReviews : currentProduct.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{selectedVariation ? selectedVariation.price : currentProduct.basePrice}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{selectedVariation ? selectedVariation.originalPrice : currentProduct.baseOriginalPrice}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                  {currentProduct.discount}% OFF
                </span>
              </div>
            </div>

            {currentProduct.attributes?.map(attribute => (
              <div key={attribute.id} className="mt-6">
                <h3 className="text-xs font-semibold text-gray-900 mb-3 tracking-wider">
                  CHOOSE {attribute.name.toUpperCase()}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {attribute.values.map(value => {
                    const testAttributes = { ...selectedAttributes, [attribute.name]: value };
                    const matchingVariation = findMatchingVariation(testAttributes);
                    const isAvailable = matchingVariation && isVariationInStock(matchingVariation);
                    const isSelected = selectedAttributes[attribute.name] === value;

                    return (
                      <button
                        key={value}
                        onClick={() => handleAttributeChange(attribute.name, value)}
                        disabled={!isAvailable}
                        className={`
                          py-2 px-1 text-center text-sm font-medium border rounded-sm relative
                          ${isSelected
                            ? 'bg-black text-white border-black'
                            : isAvailable
                              ? 'text-gray-900 border-gray-300 hover:border-black'
                              : 'text-gray-400 border-gray-200 line-through cursor-not-allowed'}
                          transition-colors duration-200
                        `}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedVariation && (
              <div className="mt-4">
                <div className={`flex items-center gap-2 text-sm font-medium ${getStockStatus(selectedVariation).color === 'green' ? 'text-green-600' :
                  getStockStatus(selectedVariation).color === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                  {getStockStatus(selectedVariation).status === 'low_stock' && (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{getStockStatus(selectedVariation).message}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-center min-w-[50px] font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(Math.min(selectedVariation?.stock || 1, 10), quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedVariation || quantity >= Math.min(selectedVariation?.stock || 1, 10)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVariation || selectedVariation.stock <= 0}
              >
                Buy it Now
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedVariation || selectedVariation.stock <= 0}
              >
                Add to Bag
              </button>

              <button
                onClick={() => addToFavorites(currentProduct)}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isFavorite(currentProduct.id) ? 'text-red-500 fill-red-500' : ''}`} />
                <span>{isFavorite(currentProduct.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <div
                  key={similarProduct.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${similarProduct.id}`)}
                >
                  <div className="relative h-48">
                    <img
                      src={getImageUrl(similarProduct.images?.[0] || '')}
                      alt={similarProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 font-medium">{similarProduct.brand || 'No Brand'}</p>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">
                      {similarProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{similarProduct.basePrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{similarProduct.baseOriginalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {[
                {
                  question: "What is the fabric composition?",
                  answer: "Our products are made from high-quality cotton, rayon, and blended fabrics. Please check the product description for specific fabric details."
                },
                {
                  question: "How do I care for this product?",
                  answer: "Most of our products are machine washable in cold water. We recommend gentle cycle and air drying for best results. Please check the care label for specific instructions."
                },
                {
                  question: "What is your return policy?",
                  answer: "We offer 7-9 days return policy for unused items in original packaging. Please visit our shipping & returns page for detailed information."
                },
                {
                  question: "How long does delivery take?",
                  answer: "Standard delivery takes 5-7 business days. Express delivery options are available at checkout for faster shipping."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Currently we ship within India only. We are working on expanding our international shipping capabilities soon."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <div className="flex items-center">
                      {expandedFaq === index ? (
                        <Minus className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-2 pl-4 pr-2 pb-2">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {reviewStats && reviewStats.totalReviews > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {reviewStats.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.round(reviewStats.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {reviewStats.totalReviews} Reviews
                    </div>
                  </div>
                </div>
                <div className="flex-1 ml-8">
                  {Object.entries(reviewStats.ratingDistribution).map(([rating, count]) => (
                    <div key={rating} className="flex items-center mb-1">
                      <span className="text-sm text-gray-600 w-12">{rating} ★</span>
                      <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${(Number(count) / reviewStats.totalReviews) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{Number(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          <div className="space-y-4">
            {existingReviews.length > 0 ? (
              existingReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{review.customer_name}</span>
                        {review.verified_purchase && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-600 mb-3">{review.description}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageModal(image)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={() => reviewsService.markReviewHelpful(review.id)}
                      className="hover:text-primary-600 transition-colors"
                    >
                      Helpful ({review.helpful_count || 0})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Write a Review Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-6">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= reviewRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Description</label>
                <textarea
                  value={reviewDescription}
                  onChange={(e) => setReviewDescription(e.target.value)}
                  placeholder="Share details about your experience with this product"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="review-images"
                  />
                  <label
                    htmlFor="review-images"
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    <span>Upload Images</span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleReviewSubmit}
                disabled={!reviewRating || !reviewTitle.trim() || !reviewDescription.trim()}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-200 transition-colors z-10 shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Review image full size"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Product Image Modal */}
        {isProductImageModalOpen && selectedProductImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={closeProductImageModal}
          >
            <button
              onClick={closeProductImageModal}
              className="absolute top-4 right-4 bg-white text-gray-800 p-3 rounded-full hover:bg-gray-200 transition-colors z-10 shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedProductImage}
                alt="Product image full size"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image navigation buttons for modal */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                      const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
                      setSelectedProductImage(getImageUrl(productImages[newIndex]));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                      const newIndex = (currentImageIndex + 1) % productImages.length;
                      setSelectedProductImage(getImageUrl(productImages[newIndex]));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

export default ProductDetail;
