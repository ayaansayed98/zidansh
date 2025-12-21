import { MessageCircle } from 'lucide-react';
import { buttonTrackingService } from '../lib/buttonTracking';

function WhatsAppWidget() {

  const handleClick = () => {
    buttonTrackingService.trackButtonClick({
      button_name: 'WhatsApp Widget',
      button_location: 'floating_widget',
      page_url: window.location.pathname
    });

    // Direct WhatsApp link
    window.open('https://wa.me/918850956896?text=Hi%20I%27m%20interested%20in%20your%20products', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-6 z-40 flex flex-col items-end">
      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-105 border-2 border-green-400 border-opacity-20 transform"
        style={{
          boxShadow: '0 0 12px rgba(34, 197, 94, 0.45), 0 0 24px rgba(34, 197, 94, 0.25)',
          filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.45)) brightness(1.03)',
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 drop-shadow-lg" />
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
      </button>

      {/* Tooltip */}
      <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
        Chat with us on WhatsApp!
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
}

export default WhatsAppWidget;
