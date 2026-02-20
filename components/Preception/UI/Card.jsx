import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm
        transition-shadow duration-200
        hover:shadow-md
        ${padding}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;