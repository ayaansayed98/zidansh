import { Facebook, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useState } from 'react';
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



  return (
    <footer className="bg-pink-200 text-black pt-8 md:pt-12 pb-8 md:pb-12 relative">
      <div className="h-1 w-full bg-purple-400/60" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed text-black">
              Your one-stop destination for all clothing needs. Authentic products, amazing prices.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-400 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/zidanshenterprise?igsh=b3o4bnJ0bGwwbGY3" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-black font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">About Us</a></li>
              <li>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-primary-400 transition text-left w-full text-sm"
                >
                  Contact Us
                </button>
              </li>
              <li><a href="#" className="hover:text-primary-400 transition">Careers</a></li>
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
      {isContactModalOpen && (
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
      )}
    </footer>
  );
}

export default Footer;
