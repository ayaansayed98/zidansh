import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from './Logo';

function TermsAndConditions() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-pink-50 py-8 md:py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-pink-100 py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="scale-150 transform transition-transform duration-500 hover:scale-110">
                        <Logo />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide mt-4">Terms and Conditions</h1>
                </div>

                <div className="p-6 md:p-10 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Zidansh. These Terms and Conditions govern your use of our website and the purchase of products from us. By accessing our website and placing an order, you agree to be bound by these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Information</h2>
                        <p>
                            We strive to display the colors and details of our products as accurately as possible. However, the actual colors you see will depend on your monitor, and we cannot guarantee that your monitor's display of any color will be accurate. All products are subject to availability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Pricing</h2>
                        <p>
                            All orders are subject to acceptance and availability. Prices for our products are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including inaccuracies or errors in product or pricing information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                        <p>
                            We aim to process and ship orders promptly. Delivery times are estimates and start from the date of shipping, rather than the date of order. We are not responsible for delays caused by customs, weather, or other unforeseen circumstances.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
                        <p>
                            Please review our separate Shipping and Returns Policy for detailed information on returns and refunds. We accept returns of unworn, unwashed items with original tags within a specified period from the date of delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                        <p>
                            All content on this website, including text, graphics, logos, images, and software, is the property of Zidansh and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content without our prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                        <p>
                            Zidansh shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on the website. Your continued use of the website following the posting of changes constitutes your acceptance of such changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms and Conditions, please contact us at: <br />
                            <span className="font-semibold">Email:</span> zidanshenterprise@gmail.com <br />
                        </p>
                    </section>

                    {/* Back Button */}
                    <div className="pt-8 border-t border-gray-100 flex justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-all transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsAndConditions;
