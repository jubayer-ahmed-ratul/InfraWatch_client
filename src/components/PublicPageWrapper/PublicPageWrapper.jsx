import React from 'react';

const PublicPageWrapper = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-base-100 ${className}`}>
      {children}
    </div>
  );
};

export default PublicPageWrapper;