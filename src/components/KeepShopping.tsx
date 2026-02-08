import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRecentlyViewed, RecentlyViewedItem } from '../lib/storage';

export const KeepShopping: React.FC = () => {
    const [history, setHistory] = useState<RecentlyViewedItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load on mount
        setHistory(loadRecentlyViewed());

        // Listen for changes if we want to be reactive, but for now mount is fine
        // since this is usually shown on the home page.
    }, []);

    if (history.length === 0) {
        return null;
    }

    return (
        <section className="py-8 bg-[#D8BFD8] border-t border-b border-purple-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Continue Text */}
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Continue where you left off
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Keep shopping for your favorite items
                        </p>
                    </div>

                    {/* Cards Container */}
                    <div className="flex overflow-x-auto gap-4 pb-2 w-full md:w-auto px-1 no-scrollbar">
                        {history.slice(0, 4).map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/product/${item.id}`)}
                                className="flex-shrink-0 w-32 md:w-48 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                            >
                                <div className="h-56 md:h-72 overflow-hidden bg-gray-100">
                                    <img
                                        src={`/zidansh img/realimg/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/zidansh img/realimg/img1.jpg';
                                        }}
                                    />
                                </div>
                                <div className="p-2">
                                    <h4 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-1">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                                        ₹{item.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
