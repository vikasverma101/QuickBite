import React from 'react';
import { motion } from 'framer-motion'
import { cardSurface } from '../../designTokens';

function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, boxShadow: '0 30px 90px rgba(15,23,42,0.08)' } : {}}
      transition={{ duration: 0.28 }}
      className={`${cardSurface} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
