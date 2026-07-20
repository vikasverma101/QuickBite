import React, { useState } from 'react'
import { FaLeaf, FaStar, FaMinus, FaPlus, FaShoppingCart, FaHeart, FaRegHeart, FaTag, FaPizzaSlice } from 'react-icons/fa'
import { FaDrumstickBite } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../redux/userSlice'
import Card from './ui/Card'
import Badge from './ui/Badge'

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0)
  const [favorite, setFavorite] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.user)

  const ratingValue = Math.round(data.rating?.average || 0)
  const ratingCount = data.rating?.count || 0
  const deliveryTime = data.deliveryTime || data.delivery || '25-35 min'
  const offerText = data.discount ? `${data.discount}% OFF` : data.offer
  const isVeg = data.foodType === 'veg'
  const bestSeller = data.bestSeller || (ratingValue >= 4 && ratingCount >= 35)
  const inCart = cartItems.some(i => i.id == data._id)

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i += 1) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className='text-amber-400 text-sm' />
        ) : (
          <FaRegStar key={i} className='text-slate-300 text-sm' />
        )
      )
    }
    return stars
  }

  const handleQuantityChange = (delta) => {
    setQuantity((current) => Math.max(0, current + delta))
  }

  const handleAddToCart = (event) => {
    event.stopPropagation()
    const addQty = quantity > 0 ? quantity : 1
    setQuantity(addQty)
    dispatch(
      addToCart({
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.image,
        shop: data.shop,
        quantity: addQty,
        foodType: data.foodType,
      })
    )
  }

  const handleCardClick = (event) => {
    if (event.target.closest('button')) return
    navigate(`/item/${data._id}`)
  }

  return (
    <Card onClick={handleCardClick} className='group relative flex h-full w-full max-w-[320px] cursor-pointer flex-col overflow-hidden border-0 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)] sm:max-w-none sm:w-[280px]'>
      <div className='relative overflow-hidden'>
        <img loading="lazy" src={data.image} alt={data.name} className='h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56' />
        <div className='absolute left-4 top-4 flex gap-2'>
          <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm ${isVeg ? 'border border-emerald-200' : 'border border-red-200'}`}>
            {isVeg ? <FaLeaf className='text-emerald-600' /> : <FaDrumstickBite className='text-red-600' />} {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          {offerText && (
            <span className='inline-flex items-center gap-1 rounded-full bg-[#ff4d2d]/95 px-3 py-1 text-xs font-semibold text-white shadow-sm'>
              <FaTag size={12} /> {offerText}
            </span>
          )}
        </div>

        {bestSeller && (
          <div className='absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white shadow-sm'>Best Seller</div>
        )}

        <button
          type='button'
          onClick={() => setFavorite(!favorite)}
          className='absolute right-4 bottom-4 z-10 rounded-full bg-white/90 p-3 text-slate-900 transition hover:bg-[#ff4d2d] hover:text-white'
        >
          {favorite ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
        </button>
      </div>

      <div className='flex flex-1 flex-col gap-4 p-4 sm:p-5'>
        <div className='space-y-3'>
          <div className='flex items-start justify-between gap-3'>
            <h2 className='text-lg font-semibold text-slate-900'>{data.name}</h2>
            <div className='rounded-3xl bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700'>₹{data.price}</div>
          </div>
          <p className='text-sm leading-6 text-slate-600'>{data.description || data.subtitle || 'Freshly prepared with premium ingredients.'}</p>
        </div>

        <div className='flex flex-wrap items-center gap-2 text-sm text-slate-500'>
          <div className='inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2'>
            {renderStars(ratingValue)}
            <span className='ml-1 font-semibold text-slate-900'>{ratingValue}.0</span>
            <span className='text-xs text-slate-500'>({ratingCount})</span>
          </div>
          <div className='inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2'>
            <FaPizzaSlice className='text-[#ff4d2d]' />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </div>

      <div className='mt-auto border-t border-slate-200 px-4 py-4 sm:px-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <button
            type='button'
            className='inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e64528]'
            onClick={handleAddToCart}
          >
            <FaShoppingCart /> {quantity > 0 ? 'Add more' : 'Quick Add'}
          </button>

          <div className='inline-flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 self-start sm:self-auto'>
            <button
              type='button'
              className='text-slate-500 transition hover:text-slate-900'
              onClick={() => handleQuantityChange(-1)}
            >
              <FaMinus />
            </button>
            <span className='min-w-[32px] text-center text-sm font-semibold text-slate-900'>{quantity}</span>
            <button
              type='button'
              className='text-slate-500 transition hover:text-slate-900'
              onClick={() => handleQuantityChange(1)}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <p className='mt-3 text-xs text-slate-500'>
          {inCart ? 'Already in cart' : 'Tap quick add to add the item to your order'}
        </p>
      </div>
    </Card>
  )
}

export default React.memo(FoodCard)
