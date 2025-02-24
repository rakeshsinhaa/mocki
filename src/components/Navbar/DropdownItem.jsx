import React from 'react';

const DropdownItem = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
  >
    {text}
  </button>
);

export default DropdownItem;