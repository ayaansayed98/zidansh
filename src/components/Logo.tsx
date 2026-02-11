import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center px-4 py-2">
      <span
        style={{
          fontFamily: '"Outfit", sans-serif',
          background: 'linear-gradient(to right, #6a11cb 0%, #ff4b1f 50%, #ff9068 100%)', // Adjusted gradient to match provided image
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          fontWeight: 800,
          fontSize: '2rem',
          backgroundColor: 'transparent',
          padding: '0 4px' // Add slight padding to prevent clipping
        }}
      >
        Zidansh
      </span>
    </Link>
  );
};

export default Logo;
