import React from 'react';

const NavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3
        rounded-lg text-left
        transition-all duration-200
        hover:bg-rose-50 hover:translate-x-1
        ${
          isActive
            ? 'bg-rose-50 text-rose-500 font-medium border-r-4 border-rose-500'
            : 'text-gray-600 hover:text-rose-400'
        }
      `}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <span className="lg:inline truncate">{label}</span>
    </button>
  );
};

export default NavItem;