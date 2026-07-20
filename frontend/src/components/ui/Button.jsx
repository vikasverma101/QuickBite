import React from 'react';
import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-[#ff4d2d] text-white hover:bg-[#e64526] shadow-[0_10px_24px_rgba(255,77,45,0.18)]',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 disabled:opacity-60 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
