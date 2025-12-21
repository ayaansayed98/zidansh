import { buttonTrackingService } from '../lib/buttonTracking';

export default function TestButtonTracking() {
  const handleTestClick = async () => {
    console.log('Test button clicked');
    await buttonTrackingService.trackButtonClick({
      button_name: 'Test Analytics Button',
      button_location: 'analytics-page',
      page_url: window.location.pathname
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleTestClick}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
      >
        Test Button Click
      </button>
    </div>
  );
}
