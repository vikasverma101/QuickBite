import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Nav from './Nav'
import { pageShell } from '../designTokens'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingAction from './FloatingAction'

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

function Layout() {
  const location = useLocation()
  return (
    <div className={`${pageShell} min-h-screen`}>
      <Nav />
      <main className='pt-[110px]'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.div key={location.pathname} initial='initial' animate='animate' exit='exit' variants={pageTransition} transition={{ duration: 0.28 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingAction />
    </div>
  )
}

export default Layout
