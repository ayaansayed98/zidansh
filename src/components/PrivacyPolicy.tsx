import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from './Logo';

function PrivacyPolicy() {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide mt-4">Privacy Policy</h1>
                </div>

                <div className="p-6 md:p-10 space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p>
                            At Zidansh, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website and purchase our products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                        <p>
                            We collect information that you strictly provide to us, such as your name, email address, phone number, shipping address, and payment information when you place an order. We may also collect non-personal information about your device and how you interact with our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you about your order status.</li>
                            <li>To improve our website and customer service.</li>
                            <li>To send you promotional emails and updates (if you have opted in).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. Your data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                        <p>
                            We use cookies to enhance your experience on our website. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Disclosure</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions regarding this Privacy Policy, you may contact us using the information below: <br />
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

export default PrivacyPolicy;
