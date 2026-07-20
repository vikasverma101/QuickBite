import React from 'react'
import { useSelector } from 'react-redux'
import { FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaPen } from 'react-icons/fa'
import OwnerItemCard from './OwnerItemCard'
import Card from './ui/Card'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { pageShell } from '../designTokens'

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  return (
    <div className={`${pageShell} flex min-h-screen w-full flex-col items-center`}>
      {!myShopData && (
        <div className='flex flex-1 items-center justify-center p-4 sm:p-6'>
          <Card className='w-full max-w-md border-0 p-6 text-center'>
            <div className='flex flex-col items-center text-center'>
              <FaUtensils className='mb-4 h-16 w-16 text-[#ff4d2d] sm:h-20 sm:w-20' />
              <h2 className='mb-2 text-xl font-semibold text-slate-900 sm:text-2xl'>Add Your Restaurant</h2>
              <p className='mb-4 text-sm text-slate-600 sm:text-base'>Join our food delivery platform and reach thousands of hungry customers every day.</p>
              <Button onClick={() => navigate('/create-edit-shop')}>Get Started</Button>
            </div>
          </Card>
        </div>
      )}

      {myShopData && (
        <div className='flex w-full flex-col items-center gap-6 px-4 sm:px-6'>
          <h1 className='mt-8 flex items-center gap-3 text-center text-2xl font-semibold text-slate-900 sm:text-3xl'>
            <FaUtensils className='h-14 w-14 text-[#ff4d2d]' />
            Welcome to {myShopData.name}
          </h1>

          <Card className='relative w-full max-w-3xl overflow-hidden border-0 p-0'>
            <div className='absolute right-4 top-4 cursor-pointer rounded-full bg-[#ff4d2d] p-2 text-white shadow-md transition hover:bg-orange-600' onClick={() => navigate('/create-edit-shop')}>
              <FaPen size={20} />
            </div>
            <img src={myShopData.image} alt={myShopData.name} className='h-48 w-full object-cover sm:h-64' />
            <div className='p-4 sm:p-6'>
              <div className='mb-2 flex items-center justify-between gap-3'>
                <h1 className='text-xl font-semibold text-slate-900 sm:text-2xl'>{myShopData.name}</h1>
                <Badge tone='brand'>Live</Badge>
              </div>
              <p className='text-slate-500'>{myShopData.city}, {myShopData.state}</p>
              <p className='mt-1 text-slate-500'>{myShopData.address}</p>
            </div>
          </Card>

          {(myShopData.items?.length || 0) === 0 && (
            <div className='flex items-center justify-center p-4 sm:p-6'>
              <Card className='w-full max-w-md border-0 p-6 text-center'>
                <div className='flex flex-col items-center text-center'>
                  <FaUtensils className='mb-4 h-16 w-16 text-[#ff4d2d] sm:h-20 sm:w-20' />
                  <h2 className='mb-2 text-xl font-semibold text-slate-900 sm:text-2xl'>Add Your Food Item</h2>
                  <p className='mb-4 text-sm text-slate-600 sm:text-base'>Share your delicious creations with our customers by adding them to the menu.</p>
                  <Button onClick={() => navigate('/add-item')}>Add Food</Button>
                </div>
              </Card>
            </div>
          )}

          {(myShopData.items?.length || 0) > 0 && (
            <div className='flex w-full max-w-3xl flex-col items-center gap-4'>
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default React.memo(OwnerDashboard)
