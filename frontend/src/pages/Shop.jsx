import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../config.js'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaStore } from 'react-icons/fa6'
import { FaLocationDot } from 'react-icons/fa6'
import { FaUtensils } from 'react-icons/fa'
import FoodCard from '../components/FoodCard'
import Skeleton from '../components/ui/Skeleton'
import { FaArrowLeft } from 'react-icons/fa'
import { getRoleHome } from '../utils/navigation'

function Shop() {
  const { shopId } = useParams()
  const [items, setItems] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)

  const handleShop = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
      setShop(result.data.shop)
      setItems(result.data.items)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleShop()
  }, [shopId])

  return (
    <div className='min-h-screen bg-[#f8fafc]'>
      <button
        className='absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-white shadow-md transition hover:bg-black/70'
        onClick={() => navigate(getRoleHome(userData))}
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      {shop && (
        <div className='relative w-full h-64 md:h-80 lg:h-96'>
          <img loading="lazy" src={shop.image} alt='' className='h-full w-full object-cover' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4'>
            <FaStore className='mb-3 text-4xl text-white drop-shadow-md' />
            <h1 className='text-3xl font-extrabold text-white drop-shadow-lg md:text-5xl'>{shop.name}</h1>
            <div className='mt-4 flex flex-wrap items-center justify-center gap-2 text-gray-200'>
              <FaLocationDot size={22} color='red' />
              <p className='text-lg font-medium'>{shop.address}</p>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-6 py-10'>
        <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-slate-900'>
          <FaUtensils color='red' /> Our Menu
        </h2>

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='space-y-4'>
                <Skeleton className='h-[320px] rounded-[32px]' />
                <Skeleton className='h-6 w-2/3 rounded-2xl' />
                <Skeleton className='h-5 w-1/2 rounded-full' />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {items.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        ) : (
          <p className='text-center text-gray-500 text-lg'>No items available.</p>
        )}
      </div>
    </div>
  )
}

export default Shop
