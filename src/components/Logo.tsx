import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center px-4 py-2">
      <span
        style={{
          fontFamily: '"Kaushan Script", "Brush Script MT", cursive',
          background: 'linear-gradient(90deg, #4B0082 0%, #8B008B 20%, #FF1493 35%, #DC143C 50%, #FF4500 70%, #FFA500 85%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          transform: 'skewX(-5deg)',
          letterSpacing: '1px',
          fontWeight: 700,
          fontSize: '1.8rem',
          backgroundColor: 'transparent',
        }}
      >
        ZIDANSH
      </span>
    </Link>
  );
};

export default Logo;
