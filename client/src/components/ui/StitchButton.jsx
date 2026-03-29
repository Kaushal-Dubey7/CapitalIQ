import React from 'react';

export default function StitchButton({ children, variant = 'primary', className = '', ...props }) {
  const btnClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  return (
    <button className={`${btnClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
