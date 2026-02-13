import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center px-4 py-2">
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          background: 'linear-gradient(90deg, #4B0082 0%, #8B008B 20%, #FF1493 35%, #DC143C 50%, #FF4500 70%, #FFA500 85%, #FFD700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px', // increased slightly for sans-serif
          fontWeight: 700,
          fontStyle: 'oblique',
          fontSize: '2.5rem',
          backgroundColor: 'transparent',
          padding: '0 4px'
        }}
      >
        ZIDANSH
      </span>
    </Link>
  );
};

export default Logo;
