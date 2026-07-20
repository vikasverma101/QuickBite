import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTachometerAlt, FaChartLine, FaBoxOpen, FaUsers, FaCog } from 'react-icons/fa'

export default function AdminSidebar({ className = '' }) {
  const navigate = useNavigate()
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> , path: '/admin' },
    { key: 'orders', label: 'Orders', icon: <FaBoxOpen /> , path: '/admin#orders' },
    { key: 'products', label: 'Products', icon: <FaChartLine /> , path: '/admin#products' },
    { key: 'users', label: 'Users', icon: <FaUsers /> , path: '/admin#users' },
    { key: 'settings', label: 'Settings', icon: <FaCog /> , path: '/admin#settings' },
  ]

  return (
    <aside className={`hidden w-64 shrink-0 flex-col gap-3 md:flex ${className}`}>
      <div className='sticky top-6 space-y-4'>
        <div className='px-3'>
          <h2 className='text-xl font-semibold text-slate-900'>Admin</h2>
          <p className='text-xs text-slate-500'>Overview</p>
        </div>
        <nav className='space-y-1 px-2'>
          {items.map((it) => (
            <button key={it.key} onClick={() => navigate(it.path)} className='flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100'>
              <span className='text-lg text-slate-600'>{it.icon}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
