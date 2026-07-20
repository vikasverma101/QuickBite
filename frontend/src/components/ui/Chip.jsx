import React from 'react';

function Chip({ children, active = false, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${active ? 'border-[#ff4d2d] bg-[#ff4d2d] text-white shadow-[0_8px_20px_rgba(255,77,45,0.18)]' : 'border-slate-200 bg-white text-slate-700 hover:border-[#ff4d2d]/60 hover:text-[#ff4d2d]'} ${className}`}
    >
      {children}
    </button>
  );
}

export default Chip;
