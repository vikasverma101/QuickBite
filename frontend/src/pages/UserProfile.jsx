import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { pageShell } from '../designTokens'
import { FaMapMarkerAlt, FaGift, FaHeart, FaCog, FaCoins, FaClock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ToastProvider.jsx'
import { setUserData } from '../redux/userSlice'

function Avatar({ name, avatarUrl, size = 84 }) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'Q'
  return (
    <div className='flex items-center gap-4'>
      {avatarUrl ? (
        <img loading="lazy" src={avatarUrl} alt='avatar' style={{ width: size, height: size }} className='rounded-full object-cover' />
      ) : (
        <div style={{ width: size, height: size }} className='grid place-items-center rounded-full bg-[#ff4d2d] text-white text-2xl font-semibold'>
          {initial}
        </div>
      )}
      <div>
        <p className='text-lg font-semibold text-slate-900'>{name || 'Guest User'}</p>
        <p className='text-sm text-slate-500'>Manage your profile details</p>
      </div>
    </div>
  )
}

export default function UserProfile() {
  const { userData, myOrders } = useSelector((s) => s.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    fullName: userData?.fullName || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
  })

  const addresses = useMemo(() => userData?.savedAddresses || [], [userData])
  const wishlist = useMemo(() => userData?.wishlist || [], [userData])
  const coupons = useMemo(() => userData?.coupons || [], [userData])
  const points = userData?.rewardPoints || userData?.points || 0

  const handleSaveProfile = () => {
    setEditMode(false)
    toast.pushToast('Profile changes saved locally (UI only).', 'success')
  }

  const handleLogout = () => {
    if (confirm('Confirm logout? This is UI-only; authentication flow remains unchanged.')) {
      dispatch(setUserData(null))
      toast.pushToast('Logged out (UI only).', 'success')
      navigate('/')
    }
  }

  return (
    <div className={`${pageShell} px-3 py-4 sm:px-4 sm:py-6 lg:px-6`}> 
      <div className='mx-auto w-full max-w-6xl space-y-6'>
        <div className='grid gap-6 lg:grid-cols-[1fr_2fr]'>
          <Card className='p-6'>
            <Avatar name={userData?.fullName} avatarUrl={userData?.avatar} />
            <div className='mt-6 flex flex-col gap-3'>
              <div className='rounded-2xl border px-4 py-3'>
                <p className='text-xs text-slate-500'>Reward points</p>
                <p className='text-lg font-semibold text-slate-900 flex items-center gap-2'><FaCoins /> {points}</p>
              </div>

              <div className='rounded-2xl border px-4 py-3'>
                <p className='text-xs text-slate-500'>Wishlist</p>
                <p className='text-sm text-slate-700'>{wishlist.length} items</p>
              </div>

              <div className='rounded-2xl border px-4 py-3'>
                <p className='text-xs text-slate-500'>Coupons</p>
                <p className='text-sm text-slate-700'>{coupons.length} available</p>
              </div>

              <div className='mt-3 grid gap-2'>
                <button onClick={() => navigate('/my-orders')} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50'><FaClock className='inline mr-2'/> View Orders</button>
                <button onClick={() => navigate('/wishlist')} className='w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50'><FaHeart className='inline mr-2'/> View Wishlist</button>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-slate-900'>Profile</h2>
              <div className='flex items-center gap-2'>
                <Button onClick={() => { setEditMode((s) => !s); setForm({ fullName: userData?.fullName || '', phone: userData?.phone || '', email: userData?.email || '' }) }}>{editMode ? 'Cancel' : 'Edit'}</Button>
              </div>
            </div>

            <div className='mt-4 grid gap-4'>
              <label className='block'>
                <p className='text-xs text-slate-500'>Full name</p>
                <input disabled={!editMode} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className='mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none' />
              </label>
              <label className='block'>
                <p className='text-xs text-slate-500'>Email</p>
                <input disabled value={form.email} className='mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none bg-slate-50' />
              </label>
              <label className='block'>
                <p className='text-xs text-slate-500'>Phone</p>
                <input disabled={!editMode} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className='mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none' />
              </label>

              {editMode && (
                <div className='mt-2 flex items-center gap-2'>
                  <Button onClick={handleSaveProfile}>Save changes</Button>
                </div>
              )}

            </div>

            <hr className='my-6 border-slate-200' />

            <h3 className='mb-3 text-sm font-semibold text-slate-800 flex items-center gap-2'><FaMapMarkerAlt/> Saved Addresses</h3>
            <div className='grid gap-3'>
              {addresses.length ? addresses.map((adr) => (
                <div key={adr._id || adr.address} className='rounded-2xl border p-4'>
                  <p className='font-medium text-slate-900'>{adr.label || 'Home'}</p>
                  <p className='text-sm text-slate-600'>{adr.text || adr.address}</p>
                </div>
              )) : (
                <p className='text-sm text-slate-500'>No saved addresses yet.</p>
              )}
            </div>

            <hr className='my-6 border-slate-200' />

            <h3 className='mb-3 text-sm font-semibold text-slate-800 flex items-center gap-2'><FaGift/> Coupons</h3>
            <div className='grid gap-2'>
              {coupons.length ? coupons.map(c => (
                <div key={c.code || c._id} className='rounded-2xl border p-3 flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-slate-900'>{c.code || 'COUPON'}</p>
                    <p className='text-sm text-slate-500'>{c.label || c.description || 'Discount coupon'}</p>
                  </div>
                  <div className='text-sm text-slate-600'>{c.expires ? `exp ${new Date(c.expires).toLocaleDateString()}` : ''}</div>
                </div>
              )) : <p className='text-sm text-slate-500'>No coupons available.</p>}
            </div>

            <hr className='my-6 border-slate-200' />

            <h3 className='mb-3 text-sm font-semibold text-slate-800 flex items-center gap-2'><FaCog/> Settings</h3>
            <div className='grid gap-3'>
              <div className='flex items-center justify-between rounded-2xl border px-4 py-3'>
                <div>
                  <p className='text-sm font-medium text-slate-900'>Notifications</p>
                  <p className='text-xs text-slate-500'>Receive app updates and offers</p>
                </div>
                <input type='checkbox' className='h-5 w-5' />
              </div>
              <div className='flex items-center justify-between rounded-2xl border px-4 py-3'>
                <div>
                  <p className='text-sm font-medium text-slate-900'>Marketing emails</p>
                  <p className='text-xs text-slate-500'>Receive promotions to your email</p>
                </div>
                <input type='checkbox' className='h-5 w-5' />
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
              <Button onClick={() => navigate('/my-orders')} variant='secondary' className='w-full sm:w-auto'>View Orders</Button>
              <Button onClick={handleLogout} className='w-full bg-rose-600 sm:w-auto'>Logout</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
