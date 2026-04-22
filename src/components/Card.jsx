import { useState } from 'react';
import { DL_COLORS } from '../tokens.js';

export default function Card({ children, style, hover, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: DL_COLORS.bgSurface,
        border: `1px solid ${hover && hovered ? 'rgba(0,201,167,0.35)' : DL_COLORS.border}`,
        borderRadius: 12, padding: '18px 20px',
        boxShadow: hover && hovered ? '0 4px 16px rgba(0,201,167,0.08)' : '0 2px 8px rgba(0,0,0,0.4)',
        transition: 'border-color 150ms, box-shadow 150ms',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
