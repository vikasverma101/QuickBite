import React from 'react';

function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return <div className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`} />;
}

export default Skeleton;
