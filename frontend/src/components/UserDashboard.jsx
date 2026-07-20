import React, { useEffect, useRef, useState } from 'react'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft } from 'react-icons/fa6'
import { FaCircleChevronRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import FoodCard from './FoodCard'
import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
import Chip from './ui/Chip'
import Skeleton from './ui/Skeleton'
import { pageShell } from '../designTokens'

function UserDashboard() {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems, searchQuery } = useSelector(state => state.user)
  const cateScrollRef = useRef()
  const shopScrollRef = useRef()
  const navigate = useNavigate()
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightCateButton, setShowRightCateButton] = useState(false)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(false)
  const [updatedItemsList, setUpdatedItemsList] = useState([])
  const loading = !shopInMyCity || !itemsInMyCity

  const handleFilterByCategory = (category) => {
    if (category == 'All') {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])


  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth)

    }
  }
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth"
      })
    }
  }




  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      cateScrollRef.current.addEventListener('scroll', () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })

    }

    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }

  }, [categories])


  return (
    <div className={`${pageShell} min-h-screen w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-6`}>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-5'>
        {searchItems && searchItems.length > 0 && (
          <Card className='w-full p-4 sm:p-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <h1 className='text-2xl font-semibold text-slate-900'>Search Results</h1>
                <p className='mt-1 text-sm text-slate-500'>Fresh matches based on your latest search.</p>
              </div>
              <Chip active>Filtered</Chip>
            </div>
            <div className='mt-4 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          </Card>
        )}

        {searchItems && searchItems.length === 0 && searchQuery && (
          <Card className='w-full p-6 text-center sm:p-10'>
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ff4d2d]/10 text-4xl sm:h-28 sm:w-28'>
              🔍
            </div>
            <h2 className='text-xl font-semibold text-slate-900 sm:text-2xl'>No results found for "{searchQuery}"</h2>
            <p className='mt-3 text-sm text-slate-500'>Try a different cuisine, category, or broader keywords.</p>
            <div className='mt-6 flex flex-wrap justify-center gap-3'>
              {['Pizza', 'Burger', 'Dessert', 'Indian', 'Fast Food'].map((term) => (
                <button key={term} className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]'>
                  {term}
                </button>
              ))}
            </div>
          </Card>
        )}

        <section className='w-full rounded-[32px] border border-slate-200/70 bg-white/70 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <h1 className='text-2xl font-semibold text-slate-900 sm:text-3xl'>Inspiration for your first order</h1>
              <p className='mt-2 text-sm text-slate-500'>Browse popular cuisines and food categories curated for your city.</p>
            </div>
            <Chip active>Fresh picks</Chip>
          </div>

          <div className='mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>
        </section>

        <section className='w-full rounded-[32px] border border-slate-200/70 bg-white/70 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6'>
          <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
            <div>
              <h1 className='text-2xl font-semibold text-slate-900 sm:text-3xl'>Best Shops in {currentCity || 'your city'}</h1>
              <p className='mt-2 text-sm text-slate-500'>Top restaurant partners serving your area right now.</p>
            </div>
            <button className='rounded-full border border-[#ff4d2d] px-4 py-2 text-sm font-semibold text-[#ff4d2d] transition hover:bg-[#ff4d2d]/10'>Explore all</button>
          </div>

          <div className='mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className='space-y-3 rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm'>
                    <Skeleton className='h-40 rounded-[28px]' />
                    <Skeleton className='h-5 w-2/3 rounded-2xl' />
                    <Skeleton className='h-4 w-1/2 rounded-full' />
                  </div>
                ))
              : shopInMyCity?.map((shop, index) => (
                  <CategoryCard
                    key={index}
                    name={shop.name}
                    image={shop.image}
                    subtitle={shop.address || shop.city || 'Local shop'}
                    label={shop.rating?.average ? `${shop.rating.average} ★` : 'Top rated'}
                    onClick={() => navigate(`/shop/${shop._id}`)}
                  />
                ))}
          </div>
        </section>

        <section className='w-full rounded-[32px] border border-slate-200/70 bg-white/70 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:p-6'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h1 className='text-2xl font-semibold text-slate-900 sm:text-3xl'>Suggested Food Items</h1>
              <p className='mt-1 text-sm text-slate-500'>Handpicked dishes that fit current cravings and offers.</p>
            </div>
          </div>

          <div className='mt-5 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {updatedItemsList?.length ? updatedItemsList.map((item, index) => (
              <FoodCard key={index} data={item} />
            )) : (
              <Card className='w-full p-6 text-center text-slate-600 sm:col-span-2 xl:col-span-3'>No items available yet for this selection.</Card>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserDashboard
