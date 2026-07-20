import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingFallback() {
  return (
    <div className='min-h-screen grid place-items-center'>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} className='h-14 w-14 rounded-full border-4 border-t-4 border-[#ff4d2d]/80 border-gray-200' />
    </div>
  )
}
