import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = false, padding = 'md' }) => {
  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[padding];

  return (
    <div 
      className={`card ${paddingClass} ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
