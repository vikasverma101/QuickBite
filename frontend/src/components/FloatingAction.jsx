import React from 'react'
import { motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'

export default function FloatingAction() {
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.32 }}
      onClick={handleClick}
      className='fixed bottom-6 right-6 z-50 hidden md:inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#ff4d2d] text-white shadow-lg'
      aria-label='Scroll to top'
    >
      <FaArrowUp />
    </motion.button>
  )
}
