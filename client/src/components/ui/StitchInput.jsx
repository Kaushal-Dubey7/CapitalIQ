import React from 'react';

export default function StitchInput({ label, id, className = '', ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginBottom: '16px' }} className={className}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        className="input-dark"
        {...props}
      />
    </div>
  );
}
