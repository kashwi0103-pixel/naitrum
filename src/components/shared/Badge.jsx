import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const statusClass = `badge-${status}`;
  
  return (
    <span className={`badge ${statusClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
