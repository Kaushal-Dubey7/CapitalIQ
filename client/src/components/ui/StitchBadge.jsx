import React from 'react';

export default function StitchBadge({ children, variant = 'emerald', className = '', ...props }) {
  let tagClass = 'tag-emerald';
  if (variant === 'gold') tagClass = 'tag-gold';
  else if (variant === 'red') tagClass = 'tag-red';

  return (
    <span className={`${tagClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
