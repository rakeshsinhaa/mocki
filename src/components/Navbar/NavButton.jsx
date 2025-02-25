import React from 'react';

const NavButton = ({ icon, text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default NavButton;