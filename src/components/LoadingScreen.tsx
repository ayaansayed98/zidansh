import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
    const [fillPercentage, setFillPercentage] = useState(0);

    useEffect(() => {
        const duration = 2000; // 2 seconds for full fill
        const frames = 60;
        const intervalTime = duration / frames;
        const increment = 100 / frames;

        const timer = setInterval(() => {
            setFillPercentage(prev => {
                if (prev >= 100) return 0; // Loop the animation
                return prev + increment;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, []);

    const textStyles: React.CSSProperties = {
        fontFamily: "'Alex Brush', cursive",
        transform: 'skewX(-5deg)',
        letterSpacing: '1px',
        fontWeight: 700,
        fontSize: '3.5rem',
        lineHeight: '1.2',
        display: 'block',
        whiteSpace: 'nowrap'
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white">
            <div className="relative flex items-center justify-center">
                {/* Invisible spacer to set container dimensions */}
                <span
                    style={{
                        ...textStyles,
                        opacity: 0,
                        userSelect: 'none',
                        padding: '0 10px' // Add padding to spacer to prevent clipping of italics/skew
                    }}
                >
                    ZIDANSH
                </span>

                {/* Background "Empty" Text (Light Gray) - Perfectly centered absolutely */}
                <span
                    style={{
                        ...textStyles,
                        position: 'absolute',
                        left: '10px', // Match padding of spacer
                        top: 0,
                        color: '#e5e7eb', // gray-200
                        userSelect: 'none'
                    }}
                >
                    ZIDANSH
                </span>

                {/* Foreground "Filled" Text (Gradient) with Clipping - Absolute overlay */}
                <div
                    style={{
                        position: 'absolute',
                        left: '10px', // Match padding of spacer
                        top: 0,
                        width: `${fillPercentage}%`,
                        height: '100%',
                        overflow: 'hidden',
                        transition: 'width 0.05s linear',
                        willChange: 'width'
                    }}
                >
                    <span
                        style={{
                            ...textStyles,
                            background: 'linear-gradient(90deg, #4B0082 0%, #8B008B 20%, #FF1493 35%, #DC143C 50%, #FF4500 70%, #FFA500 85%, #FFD700 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            userSelect: 'none'
                        }}
                    >
                        ZIDANSH
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
