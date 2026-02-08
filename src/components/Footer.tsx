import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import React, { useState, useEffect } from 'react';
import { TrackOrderModal } from './TrackOrderModal';
import { BulkOrderModal } from './BulkOrderModal';

function Footer() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isBulkOrderModalOpen, setIsBulkOrderModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleTrackOrder = (orderId: string) => {
    // Here you would typically make an API call to track the order
    // For now, we'll just show an alert with the order ID
    alert(`Tracking order: ${orderId}`);
    // You can replace the alert with actual tracking logic
    // For example: navigate(`/track-order/${orderId}`);

    // Close the modal after handling
    setIsTrackModalOpen(false);
  };

  // Helper to get cookie value
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    // Check existing Google Translate cookie
    const cookie = getCookie('googtrans');
    if (cookie) {
      // Cookie format is like /en/hi
      const langCode = cookie.split('/')[2];
      if (langCode) setSelectedLang(langCode);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    setSelectedLang(langCode);

    // Set Google Translate cookie
    // Format: /sourceLang/targetLang
    const cookieValue = `/en/${langCode}`;

    // Set cookie for widely compatible domain paths
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`; // Fallback for localhost

    // Reload to trigger translation
    window.location.reload();
  };

  return (
    <footer className="bg-pink-200 text-black pt-8 md:pt-12 pb-8 md:pb-12 relative">
      <div className="h-1 w-full bg-purple-400/60" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed text-black">
              Your one-stop destination for all clothing needs. Authentic products, amazing prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-400 transition" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/zidanshenterprise?igsh=b3o4bnJ0bGwwbGY3" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-black font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary-400 transition">About Us</Link></li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-primary-400 transition text-left w-full text-sm"
                >
                  Contact Us
                </button>
              </li>

              <li>
                <button
                  onClick={() => setIsBulkOrderModalOpen(true)}
                  className="hover:text-primary-400 transition text-left w-full text-sm"
                >
                  Bulk Order
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-black font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">Help Center</a></li>
              <li><Link to="/shipping-returns" className="hover:text-primary-400 transition">Shipping and Returns Info</Link></li>
              <li>
                <button
                  onClick={() => setIsTrackModalOpen(true)}
                  className="hover:text-primary-400 transition text-left w-full text-sm"
                >
                  Track Order
                </button>
              </li>

            </ul>
          </div>

          <div>
            <h4 className="text-black font-semibold mb-4">Language</h4>
            <div className="relative">
              <select
                className="bg-white border border-purple-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                value={selectedLang}
                onChange={handleLanguageChange}
                aria-label="Select Language"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="ur">Urdu (اردو)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="as">Assamese (অসমীয়া)</option>
                <option value="mai">Maithili (मैथिली)</option>
                <option value="sat">Santali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
                <option value="ks">Kashmiri (कश्मीरी)</option>
                <option value="ne">Nepali (नेपाली)</option>
                <option value="kok">Konkani (कोंकणी)</option>
                <option value="sd">Sindhi (सिन्धी)</option>
                <option value="doi">Dogri (डोगरी)</option>
                <option value="mni">Manipuri (মৈতৈলোন্)</option>
                <option value="brx">Bodo (बर')</option>
                <option value="sa">Sanskrit (संस्कृतम्)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-center text-sm relative z-10">
          <p className="mb-2 text-black">&copy; 2025 <span style={{
            fontFamily: '"Brush Script MT", cursive, "Comic Sans MS", sans-serif',
            background: 'linear-gradient(90deg, #4B0082 0%, #8B008B 20%, #FF1493 35%, #DC143C 50%, #FF4500 70%, #FFA500 85%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transform: 'skewX(-5deg)',
            letterSpacing: '1px',
            display: 'inline-block',
            fontWeight: 700,
            fontSize: '1.05rem'
          }}>ZIDANSH</span>. All rights reserved.</p>
        </div>

        {/* spacer removed to eliminate extra bottom space */}
      </div>

      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onTrack={handleTrackOrder}
      />

      <BulkOrderModal
        isOpen={isBulkOrderModalOpen}
        onClose={() => setIsBulkOrderModalOpen(false)}
        onSubmit={(order: { type: string; quantity: number; details: string }) => {
          // Handle the bulk order submission
          alert(`Bulk order received!\nType: ${order.type}\nQuantity: ${order.quantity}\nDetails: ${order.details || 'None'}`);
        }}
      />

      {/* Contact Modal */}
      {
        isContactModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-6">
                How would you like to contact us? Choose your preferred method:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.open('https://wa.me/918850956896?text=Hi%20Zidansh,%20I%20have%20a%20question%20about%20your%20products', '_blank');
                    setIsContactModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    window.open('https://www.instagram.com/zidanshenterprise?igsh=MTc5cGIwcW01OHhoeg%3D%3D&utm_source=qr', '_blank');
                    setIsContactModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Contact via Instagram</span>
                </button>

                <button
                  onClick={() => {
                    // Open Gmail web interface with only recipient pre-filled
                    const email = 'zidanshenterprise@gmail.com';

                    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;
                    window.open(gmailUrl, '_blank');
                    setIsContactModalOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact via Email</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  We'll respond as soon as possible during business hours.
                </p>
              </div>

              <button
                onClick={() => setIsContactModalOpen(false)}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )
      }
    </footer >
  );
}

export default Footer;
