import React from 'react';

function Badge({ children, tone = 'brand', className = '' }) {
  const tones = {
    brand: 'bg-[#fff2eb] text-[#ff4d2d]',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone] || tones.brand} ${className}`}>{children}</span>;
}

export default Badge;
