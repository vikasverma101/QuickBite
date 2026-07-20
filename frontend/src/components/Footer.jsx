import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className='mt-14 w-full border-t border-slate-200/60 bg-white/80 backdrop-blur-xl px-4 py-10 sm:px-6 lg:px-8'
    >
      <div className='mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
        <div className='max-w-sm space-y-4'>
          <div className='inline-flex items-center gap-2 rounded-full bg-[#ff4d2d]/10 px-4 py-2 text-sm font-semibold text-[#bb3219]'>
            QuickBite
          </div>
          <p className='text-sm leading-6 text-slate-600'>A modern delivery experience for restaurants, riders, and hungry customers. Enjoy faster ordering, smarter tracking, and vivid foodie moments.</p>
          <p className='text-sm text-slate-500'>© {new Date().getFullYear()} QuickBite. All rights reserved.</p>
        </div>

        <div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold text-slate-900'>Product</h3>
            <ul className='space-y-2 text-sm text-slate-600'>
              <li>Order management</li>
              <li>Live tracking</li>
              <li>Secure checkout</li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold text-slate-900'>Company</h3>
            <ul className='space-y-2 text-sm text-slate-600'>
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold text-slate-900'>Support</h3>
            <ul className='space-y-2 text-sm text-slate-600'>
              <li>Help center</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
