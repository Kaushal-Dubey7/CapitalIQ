import React, { useEffect, useState } from 'react';

export default function StitchProgressRing({ score, maxScore = 100, label = '', color = 'var(--accent-emerald)', size = 200, strokeWidth = 16 }) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Animate from 0 to score
    const progressOffset = ((maxScore - score) / maxScore) * circumference;
    setOffset(circumference); // Start empty
    setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
  }, [score, maxScore, circumference]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center text */}
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: `${size * 0.25}px`, fontWeight: '800', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
          {score}
        </span>
        {label && (
           <span style={{ fontSize: `${size * 0.08}px`, color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
             {label}
           </span>
        )}
      </div>
    </div>
  );
}
