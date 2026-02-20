import React from 'react';

const NavItem = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3.5 px-6 py-3.5
        text-sm font-medium
        transition-all duration-300 ease-out
        relative overflow-hidden
        group
        ${isActive
          ? 'bg-rose-50/80 text-rose-600 border-r-[3px] border-rose-500'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <span className="lg:inline truncate">{label}</span>
    </button>
  );
};

export default NavItem;