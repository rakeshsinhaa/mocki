import React from 'react';

const FeatureCard = ({ title, description, icon, image, onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            {icon}
          </div>
          <h3 className="ml-3 text-xl font-semibold text-gray-900">
            {title}
          </h3>
        </div>
        <p className="text-gray-600">
          {description}
        </p>
        <button 
          onClick={onClick}
          className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;