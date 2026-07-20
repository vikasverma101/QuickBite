import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'
import { categories } from '../category'
import CategoryCard from '../components/CategoryCard'
import FoodCard from '../components/FoodCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Chip from '../components/ui/Chip'
import heroImage10 from '../assets/image10.avif'
import heroImage8 from '../assets/image8.avif'
import heroImage4 from '../assets/image4.avif'

const featuredRestaurants = [
  {
    name: 'Savory Street Kitchen',
    category: 'Fine Dining',
    rating: 4.9,
    delivery: '20-30 min',
    image: heroImage10,
  },
  {
    name: 'Urban Grill Co.',
    category: 'BBQ & Burgers',
    rating: 4.8,
    delivery: '15-25 min',
    image: heroImage8,
  },
  {
    name: 'Sweet Bloom Bakery',
    category: 'Desserts',
    rating: 4.9,
    delivery: '10-20 min',
    image: heroImage4,
  },
]

const trendingItems = [
  {
    title: 'Truffle Mushroom Pizza',
    description: 'Crispy crust, wood-fired cheese, and premium truffle drizzle.',
    price: '$16.99',
    image: heroImage10,
  },
  {
    title: 'Smoky Angus Burger',
    description: 'Juicy patty, caramelized onions, and signature smoky sauce.',
    price: '$13.50',
    image: heroImage8,
  },
  {
    title: 'Berry Bliss Pancakes',
    description: 'Fluffy pancakes topped with berries and whipped cream.',
    price: '$9.99',
    image: heroImage4,
  },
]

const testimonials = [
  {
    name: 'Mia R.',
    role: 'Foodie & Influencer',
    quote: 'QuickBite transformed my dinner plans — lightning-fast delivery with a premium experience.',
  },
  {
    name: 'Noah T.',
    role: 'Busy Professional',
    quote: 'The app feels polished, modern, and makes ordering from top restaurants easy.',
  },
]

const Home = () => {
  const [activeChip, setActiveChip] = useState('popular')
  const categoriesRef = useRef(null)
  const featuredRef = useRef(null)
  const trendingRef = useRef(null)

  const handleScrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleOrderNowClick = () => handleScrollTo(categoriesRef)
  const handleExploreRestaurantsClick = () => handleScrollTo(featuredRef)
  const handleFastDeliveryClick = () => {
    setActiveChip('fastDelivery')
    handleScrollTo(trendingRef)
  }
  const handleChefsPickClick = () => {
    setActiveChip('chefsPick')
    handleScrollTo(trendingRef)
  }

  return (
    <div className='space-y-24 px-6 py-10 md:px-12 lg:px-20'>
      <section className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-8'
        >
          <Badge className='uppercase tracking-[0.3em]'>Premium food delivery</Badge>
          <div className='space-y-6'>
            <h1 className='text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl'>
              Rediscover gourmet delivery with a premium, effortless experience.
            </h1>
            <p className='max-w-2xl text-lg leading-8 text-slate-600'>
              QuickBite brings top restaurants, curated menus, and real-time order tracking into a beautiful, modern landing experience.
            </p>
          </div>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button type='button' className='min-w-[160px]' onClick={handleOrderNowClick}>Order now</Button>
            <Button type='button' variant='secondary' className='min-w-[160px]' onClick={handleExploreRestaurantsClick}>Explore restaurants</Button>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)]'>
              <p className='text-5xl font-semibold text-slate-900'>24</p>
              <p className='mt-2 text-sm text-slate-500'>Top rated restaurants</p>
            </div>
            <div className='rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.06)]'>
              <p className='text-5xl font-semibold text-slate-900'>99%</p>
              <p className='mt-2 text-sm text-slate-500'>On-time delivery rating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className='relative overflow-hidden rounded-[40px] bg-[#ff4d2d]/5 p-6 shadow-[0_45px_120px_rgba(255,77,45,0.12)]'
        >
          <div className='absolute -right-20 top-12 h-48 w-48 rounded-full bg-[#ff4d2d]/10 blur-3xl' />
          <div className='absolute left-8 top-32 h-28 w-28 rounded-full bg-[#ff4d2d]/10 blur-3xl' />
          <img loading="lazy" src={heroImage10} alt='Hero plate' className='relative mx-auto h-[360px] w-full rounded-[32px] object-cover shadow-[0_30px_60px_rgba(15,23,42,0.18)]' />
        </motion.div>
      </section>

      <section className='space-y-8'>
        <div ref={categoriesRef} className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.35em] text-[#ff4d2d]'>Discover by cuisine</p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Curated categories for every craving.</h2>
          </div>
          <Button type='button' variant='ghost' className='hidden md:inline-flex' onClick={handleExploreRestaurantsClick}>See all categories</Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
          {categories.map((item) => (
            <CategoryCard key={item.category} name={item.category} image={item.image} />
          ))}
        </div>
      </section>

      <section className='space-y-8'>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.35em] text-slate-500'>Trending now</p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Chef favorites delivered fast.</h2>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Chip active={activeChip === 'popular'} onClick={() => { setActiveChip('popular'); handleScrollTo(trendingRef) }}>Popular</Chip>
            <Chip active={activeChip === 'fastDelivery'} onClick={handleFastDeliveryClick}>Fast delivery</Chip>
            <Chip active={activeChip === 'chefsPick'} onClick={handleChefsPickClick}>Chef’s pick</Chip>
          </div>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          {trendingItems.map((item) => (
            <FoodCard key={item.title} data={item} />
          ))}
        </div>
      </section>

      <section ref={featuredRef} className='space-y-8'>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.35em] text-slate-500'>Featured restaurants</p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Premium kitchens across your city.</h2>
          </div>
          <Button variant='secondary'>View all partners</Button>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          {featuredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.name}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]'
            >
              <img loading="lazy" src={restaurant.image} alt={restaurant.name} className='h-56 w-full object-cover' />
              <div className='space-y-4 p-6'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <h3 className='text-xl font-semibold text-slate-900'>{restaurant.name}</h3>
                    <p className='text-sm text-slate-500'>{restaurant.category}</p>
                  </div>
                  <Badge tone='success'>{restaurant.rating} ★</Badge>
                </div>
                <p className='text-sm leading-6 text-slate-600'>{restaurant.delivery} delivery</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='grid gap-8 lg:grid-cols-[1fr_0.9fr]'>
        <div className='space-y-6 rounded-[36px] border border-slate-200 bg-[#f8fafc] p-10 shadow-[0_28px_80px_rgba(15,23,42,0.05)]'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.35em] text-[#ff4d2d]'>What our guests say</p>
            <h2 className='mt-3 text-3xl font-semibold text-slate-900'>A dining experience designed for modern lifestyles.</h2>
          </div>
          <div className='space-y-6'>
            {testimonials.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className='rounded-3xl bg-white p-8 shadow-sm'
              >
                <p className='text-lg leading-8 text-slate-700'>“{item.quote}”</p>
                <div className='mt-6 flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600'>
                    <FaUser className='h-6 w-6' />
                  </div>
                  <div>
                    <p className='font-semibold text-slate-900'>{item.name}</p>
                    <p className='text-sm text-slate-500'>{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className='rounded-[36px] bg-[#1f2937] p-10 text-white shadow-[0_28px_80px_rgba(15,23,42,0.14)]'
        >
          <p className='text-sm font-semibold uppercase tracking-[0.35em] text-[#fca5a5]'>Download the app</p>
          <h2 className='mt-3 text-3xl font-semibold'>Order premium food anytime, anywhere.</h2>
          <p className='mt-4 max-w-xl text-sm leading-7 text-slate-300'>Get a personalized home screen, real-time tracking, and exclusive restaurant drops directly in the app.</p>
          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <Button type='button' className='w-full bg-white text-slate-900 hover:bg-slate-100'>App Store</Button>
            <Button type='button' variant='ghost' className='w-full border border-white text-white hover:bg-white/10'>Google Play</Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
