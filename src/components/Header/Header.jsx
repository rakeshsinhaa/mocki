import React from 'react';

const Header = () => {
  return (
    <header className="pt-25  px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeIn">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mocki-fi
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slideUp">
          Your comprehensive educational companion for mock tests, AI-powered translations, 
          and extensive question paper practice. Elevate your learning journey with our 
          cutting-edge platform designed for student success.
        </p>
      </div>
    </header>
  );
};

export default Header;