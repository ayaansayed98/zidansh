function OfferBanner() {
  const offers = [
    { title: 'Free Shipping', desc: 'On orders above ₹999' },
    { title: 'Authentic Products', desc: '100% Original' },
    { title: 'Easy Returns', desc: '7-9 Days Return Policy' },
    { title: 'Secure Payments', desc: 'Safe & Encrypted' },
  ];

  return (
    <div className="py-4 bg-primary-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {offers.map((offer, index) => (
            <div key={index} className="space-y-1">
              <p className="font-semibold text-sm">{offer.title}</p>
              <p className="text-xs opacity-80">{offer.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OfferBanner;
