import React from 'react';

export default function StitchCard({ children, className = '', style = {}, ...props }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: '24px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
