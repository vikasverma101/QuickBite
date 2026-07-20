import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((previous) => [{ id, message, type }, ...previous])
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className='pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-end px-4 sm:px-6'>
        <div className='space-y-3'>
          <AnimatePresence initial={false}>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 30, y: -10 }}
                transition={{ duration: 0.2 }}
                className='pointer-events-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
              >
                <div className={`flex items-center gap-3 px-4 py-3 ${toast.type === 'success' ? 'text-slate-900' : toast.type === 'error' ? 'text-rose-600' : 'text-slate-900'}`}>
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : toast.type === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                    {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
                  </span>
                  <div>
                    <p className='text-sm font-semibold'>{toast.type === 'error' ? 'Oops!' : toast.type === 'success' ? 'Success' : 'Notice'}</p>
                    <p className='text-sm text-slate-600'>{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
