import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import Logo from './Logo';

function AboutUs() {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wide mt-4">About Us</h1>
                </div>

                <div className="p-6 md:p-10 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-2 h-8 bg-pink-500 mr-3 rounded-full"></span>
                            Our Story
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Welcome to <span className="font-semibold text-pink-600">Zidansh</span>, your ultimate destination for authentic and stylish ethnic wear.
                            Founded with a passion for indian fashion, we aim to bring you the finest collection of Kurtis, Co-ord Sets, and Suits that blend traditional elegance with contemporary designs.
                        </p>
                    </section>

                    {/* Mission */}
                    <section className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our mission is simple: to make high-quality, fashionable ethnic wear accessible to everyone. We believe that every woman deserves to feel confident and beautiful in what she wears.
                            That's why we carefully curate our fabrics and designs to ensure comfort, durability, and style in every stitch.
                        </p>
                    </section>

                    {/* Values */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
                                <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
                                <p className="text-gray-600 text-sm">We use only the finest fabrics to ensure maximum comfort and longevity.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚚</div>
                                <h3 className="font-bold text-gray-900 mb-2">Fast Shipping</h3>
                                <p className="text-gray-600 text-sm">Quick and reliable delivery to get your favorites to you on time.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💖</div>
                                <h3 className="font-bold text-gray-900 mb-2">Customer First</h3>
                                <p className="text-gray-600 text-sm">Your satisfaction is our top priority. We are here to help you.</p>
                            </div>
                        </div>
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

export default AboutUs;
