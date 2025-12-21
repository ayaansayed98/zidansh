import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Logo from './Logo';

function ShippingReturns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
  <div className="min-h-screen bg-[#E6E6FA] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-100 group"
            aria-label="Close and go back to website"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Shipping and Return</h2>
          <p className="text-lg text-gray-600 mt-2">Return, Refund, and Exchange Policy</p>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* 1. Return Policy */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">1. Return Policy</h3>
            <p className="text-gray-600 mb-4">
              We at Zidansh Enterprise value customer satisfaction and aim to provide a seamless shopping experience. Our return policy allows you to return items within 48 hours of receipt if you are not satisfied with your purchase. Please review the terms and conditions below:
            </p>
            
            <div className="space-y-4 ml-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Eligibility for Return:</h4>
                <p className="text-gray-600">
                  Items must be in the same condition as received, unworn or unused, with tags, and in the original packaging. Proof of purchase is required. Rs.150 per saree will be deducted as restocking charges.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Process:</h4>
                <p className="text-gray-600">
                  Contact us at <a href="mailto:zidanshenterprise@gmail.com" className="text-blue-700 hover:text-blue-900 font-bold">zidanshenterprise@gmail.com</a> to request a return. Once your return is accepted, we will send you a return shipping label and instructions. Items sent back without prior approval will not be accepted.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Non-Returnable Items:</h4>
                <p className="text-gray-600">
                  Customized products, items with fall and edging or blouse stitching, and products from clearance sales or promotional offers (e.g., 'Buy 1 Get 1 Free') are not eligible for return.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Damages and Issues */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">2. Damages and Issues</h3>
            
            <div className="space-y-4 ml-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Inspection:</h4>
                <p className="text-gray-600">
                  Please inspect your order once received. If you receive a defective, damaged, or incorrect item, contact us immediately at <a href="mailto:zidanshenterprise@gmail.com" className="text-blue-700 hover:text-blue-900 font-bold">zidanshenterprise@gmail.com</a> so we can resolve the issue promptly.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Exchange Policy */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">3. Exchange Policy</h3>
            
            <div className="space-y-4 ml-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Eligibility for Exchange:</h4>
                <p className="text-gray-600">
                  To exchange an item, first request a return for the original item. Once the return is accepted, you can place a separate order for the new item.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Process:</h4>
                <p className="text-gray-600">
                  Raise an exchange request within 48 hours of receiving the product. We will arrange a pick-up from your doorstep if serviceable. In unserviceable areas, you must ship the product at your own cost. Exchanges are processed within 5-7 business days of receiving the item.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Non-Exchangeable Items:</h4>
                <p className="text-gray-600">
                  Customized products, pure silk products, and products from clearance sales or promotional offers are not eligible for exchange.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Refund Policy */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Refund Policy</h3>
            
            <div className="space-y-4 ml-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Approval and Processing:</h4>
                <p className="text-gray-600">
                  Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 10 business days and credited to your original payment method. Note that it may take additional time for your bank or credit card company to process the refund.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Non-Refundable Items:</h4>
                <p className="text-gray-600">
                  Orders worth more than Rupees 1000 are not eligible for a refund but can be exchanged. Return shipping charges are non-refundable, and Rs.150 per item will be deducted as restocking charges.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Delayed Refunds:</h4>
                <p className="text-gray-600">
                  If more than 15 business days have passed since we approved your return and you have not received your refund, please contact us at <a href="mailto:zidanshenterprise@gmail.com" className="text-blue-600 hover:text-blue-800 font-bold">zidanshenterprise@gmail.com</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Time */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Time</h3>
            <p className="text-gray-600 ml-6">
              <strong>7-9 Business Days</strong>
            </p>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShippingReturns;
