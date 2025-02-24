import React from 'react';

const MobileNavButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default MobileNavButton;