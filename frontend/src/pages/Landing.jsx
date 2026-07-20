import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'
import { FaStar, FaTruck, FaShieldAlt, FaClock, FaHeadset, FaMapMarkerAlt, FaApple, FaGooglePlay } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Chip from '../components/ui/Chip'
import { categories } from '../category'
import heroImage10 from '../assets/image10.avif'
import heroImage8 from '../assets/image8.avif'
import heroImage4 from '../assets/image4.avif'
import snacksImage from '../assets/snaks.webp'

const featuredRestaurants = [
  {
    name: 'Savory Street Kitchen',
    cuisine: 'Italian • Pizza',
    rating: 4.9,
    delivery: '20-30 min',
    image: heroImage10,
  },
  {
    name: 'Urban Grill Co.',
    cuisine: 'American • Burgers',
    rating: 4.8,
    delivery: '15-25 min',
    image: heroImage8,
  },
  {
    name: 'Sweet Bloom Bakery',
    cuisine: 'Bakery • Desserts',
    rating: 4.9,
    delivery: '10-20 min',
    image: heroImage4,
  },
]

const trendingFoods = [
  {
    title: 'Snacks & Fries',
    price: '$16.99',
    image: snacksImage,
    rating: 4.9,
  },
  {
    title: 'Indian simple food',
    price: '$13.50',
    image: heroImage8,
    rating: 4.8,
  },
  {
    title: 'pizza with extra cheese',
    price: '$9.99',
    image: heroImage4,
    rating: 4.9,
  },
]

const testimonials = [
  {
    name: 'Mia R.',
    title: 'Foodie & Influencer',
    quote: 'QuickBite transformed my dinner plans — lightning-fast delivery with a premium experience.',
  },
  {
    name: 'Noah T.',
    title: 'Busy Professional',
    quote: 'The app feels polished, modern, and makes ordering from top restaurants easy.',
  },
  {
    name: 'Ava S.',
    title: 'Happy Customer',
    quote: 'I love the freshness, speed, and the clean design. It feels like the future of food delivery.',
  },
]

const stats = [
  { label: 'Restaurants', value: '120+' },
  { label: '5★ Reviews', value: '98%' },
  { label: 'Cities Live', value: '12' },
]

const benefits = [
  { icon: <FaTruck className='h-5 w-5' />, title: 'Fast Delivery', description: 'Order meals in minutes and enjoy hot food delivered fast.' },
  { icon: <FaShieldAlt className='h-5 w-5' />, title: 'Secure Payment', description: 'Safe checkout with multiple payment options.' },
  { icon: <FaClock className='h-5 w-5' />, title: 'Live Tracking', description: 'Follow your order from kitchen to doorstep.' },
  { icon: <FaHeadset className='h-5 w-5' />, title: '24/7 Support', description: 'Friendly support whenever you need it.' },
]

const Landing = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogin = () => navigate('/signin')
  const handleSignup = () => navigate('/signup')

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#fff9f6] text-slate-900'>
      <header className='sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-sm'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='inline-flex h-12 w-12 items-center justify-center rounded bg-[white] text-xl font-bold text-white '><img src='/logo.png' alt='QuickBite logo' className='h-full w-full object-contain' /></div>
            <div>
              <p className='text-lg font-semibold text-slate-900'>QuickBite</p>
              <p className='text-xs uppercase tracking-[0.35em] text-[#ff4d2d]'>Food delivery</p>
            </div>
          </div>

          <nav className='hidden items-center gap-8 md:flex'>
            <a href='#home' className='text-sm font-medium text-slate-700 transition hover:text-[#ff4d2d]'>Home</a>
            <a href='#features' className='text-sm font-medium text-slate-700 transition hover:text-[#ff4d2d]'>Features</a>
            <a href='#popular-foods' className='text-sm font-medium text-slate-700 transition hover:text-[#ff4d2d]'>Popular Foods</a>
            <a href='#about' className='text-sm font-medium text-slate-700 transition hover:text-[#ff4d2d]'>About</a>
            <a href='#contact' className='text-sm font-medium text-slate-700 transition hover:text-[#ff4d2d]'>Contact</a>
          </nav>

          <div className='hidden items-center gap-3 md:flex'>
            <Button variant='ghost' size='sm' className='text-slate-700 hover:bg-slate-100' onClick={handleLogin}>Sign In</Button>
            <Button size='sm' className='rounded-full px-5 py-2.5' onClick={handleSignup}>Sign Up</Button>
          </div>

          <button className='inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 md:hidden' onClick={() => setMobileMenuOpen((prev) => !prev)}>
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className='border-t border-slate-200 bg-white/95 px-4 py-4 md:hidden'>
            <div className='flex flex-col gap-3'>
              <a href='#home' className='text-base font-medium text-slate-700'>Home</a>
              <a href='#features' className='text-base font-medium text-slate-700'>Features</a>
              <a href='#popular-foods' className='text-base font-medium text-slate-700'>Popular Foods</a>
              <a href='#about' className='text-base font-medium text-slate-700'>About</a>
              <a href='#contact' className='text-base font-medium text-slate-700'>Contact</a>
              <Button variant='ghost' className='w-full text-left text-slate-700' onClick={handleLogin}>Sign In</Button>
              <Button className='w-full' onClick={handleSignup}>Sign Up</Button>
            </div>
          </motion.div>
        )}
      </header>

      <main>
        <section id='home' className='relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:px-8'>
          <div className='mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between'>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className='max-w-2xl space-y-6'>
              <Badge className='uppercase tracking-[0.35em]'>Fresh food, faster</Badge>
              <h1 className='text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>Delicious food delivered to your doorstep, anytime.</h1>
              <p className='max-w-xl text-lg leading-8 text-slate-600'>Discover top restaurants, curated menus, and lightning-fast delivery in one premium food ordering experience.</p>

              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button className='min-w-[160px]' onClick={handleLogin}>Order Now</Button>
                <Button variant='secondary' className='min-w-[160px]' onClick={handleSignup}>Create Account</Button>
              </div>

              <div className='grid gap-4 sm:grid-cols-3'>
                {stats.map((item) => (
                  <div key={item.label} className='rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_30px_60px_rgba(15,23,42,0.08)]'>
                    <p className='text-3xl font-semibold text-slate-900'>{item.value}</p>
                    <p className='mt-2 text-sm uppercase tracking-[0.3em] text-slate-500'>{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className='relative mx-auto w-full max-w-xl'>
              <div className='absolute -right-10 top-10 h-48 w-48 rounded-full bg-[#ff4d2d]/10 blur-3xl' />
              <div className='absolute left-0 top-40 h-28 w-28 rounded-full bg-[#f97316]/10 blur-3xl' />
              <div className='relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-6 shadow-[0_40px_120px_rgba(255,77,45,0.12)]'>
                <div className='absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#f97316]/20 blur-3xl' />
                <img loading='lazy' src={heroImage10} alt='Hero plate' className='relative z-10 h-[420px] w-full rounded-[32px] object-cover shadow-xl' />
                <div className='absolute bottom-6 left-6 w-[220px] rounded-3xl border border-white/60 bg-white/90 px-4 py-4 shadow-xl backdrop-blur-xl'>
                  <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Chef’s special</p>
                  <p className='mt-1 text-lg font-semibold text-slate-900'>Truffle mushroom pizza</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id='search-preview' className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='rounded-[40px] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Preview search</p>
                <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Find your favorite meals in a flash.</h2>
              </div>
              <Button size='lg' onClick={handleLogin}>Sign in to search</Button>
            </div>

            <div className='mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]'>
              <div className='rounded-[32px] border border-slate-200 bg-slate-50 p-4'>
                <div className='flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm'>
                  <FiSearch className='h-5 w-5 text-slate-400' />
                  <input readOnly placeholder='Search dishes, restaurants, or cuisines' className='w-full bg-transparent text-sm text-slate-700 outline-none' />
                </div>
                <div className='mt-4 flex flex-wrap gap-3'>
                  {['Pizza', 'Burgers', 'Desserts', 'Indian', 'Healthy', 'Beverages'].map((chip) => (
                    <Chip key={chip} className='cursor-default'>{chip}</Chip>
                  ))}
                </div>
              </div>
              <div className='grid gap-4'>
                <div className='rounded-[32px] bg-[#ff4d2d]/10 p-6'>
                  <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Popular searches</p>
                  <div className='mt-4 space-y-3 text-sm text-slate-700'>
                    <p>Cheese burst pizza</p>
                    <p>Signature burgers</p>
                    <p>Matcha desserts</p>
                  </div>
                </div>
                <div className='rounded-[32px] bg-slate-950 p-6 text-white'>
                  <p className='text-sm uppercase tracking-[0.35em] text-slate-300'>Quick preview</p>
                  <p className='mt-4 text-lg font-semibold'>Swipe through premium meals before you log in.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='popular-foods' className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Popular categories</p>
              <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Meals for every craving.</h2>
            </div>
            <Button variant='ghost' onClick={handleSignup}>See all categories</Button>
          </div>

          <div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {categories.map((item) => (
              <motion.div key={item.category} whileHover={{ y: -6 }} className='overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]'>
                <div className='mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50'>
                  <img loading='lazy' src={item.image} alt={item.category} className='h-40 w-full object-cover' />
                </div>
                <p className='text-xl font-semibold text-slate-900'>{item.category}</p>
                <p className='mt-3 text-sm leading-6 text-slate-600'>Explore the best {item.category.toLowerCase()} crafted by top kitchens.</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id='about' className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
            <div className='space-y-6'>
              <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Featured restaurants</p>
              <h2 className='text-3xl font-semibold text-slate-900'>Restaurants your city loves.</h2>
              <p className='max-w-xl text-lg leading-8 text-slate-600'>Browse premium kitchens with high ratings, fast delivery, and exclusive deals. Each restaurant is handpicked for freshness and flavor.</p>
            </div>

            <div className='space-y-4'>
              {featuredRestaurants.map((restaurant) => (
                <motion.div key={restaurant.name} whileHover={{ y: -6 }} className='rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]'>
                  <div className='grid gap-4 sm:grid-cols-[1fr_auto]'>
                    <div>
                      <p className='text-lg font-semibold text-slate-900'>{restaurant.name}</p>
                      <p className='mt-1 text-sm text-slate-500'>{restaurant.cuisine}</p>
                    </div>
                    <Badge tone='success'>{restaurant.rating} ★</Badge>
                  </div>
                  <div className='mt-4 flex items-center justify-between text-sm text-slate-500'>
                    <span>{restaurant.delivery}</span>
                    <span>Fast delivery</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Trending foods</p>
              <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Popular picks with irresistible flavors.</h2>
            </div>
            <Button variant='ghost' onClick={handleLogin}>Sign in to add</Button>
          </div>

          <div className='mt-8 grid gap-4 md:grid-cols-3'>
            {trendingFoods.map((food) => (
              <motion.div key={food.title} whileHover={{ y: -8 }} className='overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]'>
                <img loading='lazy' src={food.image} alt={food.title} className='h-56 w-full object-cover' />
                <div className='p-6'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-900'>{food.title}</h3>
                      <p className='mt-2 text-sm text-slate-500'>Rating {food.rating} ★</p>
                    </div>
                    <p className='text-lg font-semibold text-slate-900'>{food.price}</p>
                  </div>
                  <div className='mt-6 flex items-center justify-between gap-3'>
                    <Button variant='secondary' className='w-full text-sm' onClick={handleLogin}>Add</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id='features' className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-[0.9fr_0.95fr]'>
            <div className='space-y-6'>
              <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Why choose FoodWalla</p>
              <h2 className='text-3xl font-semibold text-slate-900'>A powerful food ordering experience, designed for modern life.</h2>
              <p className='max-w-xl text-lg leading-8 text-slate-600'>Enjoy fresh food from the best local kitchens, rapid delivery, and a delightful ordering experience from start to finish.</p>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {benefits.map((benefit) => (
                <motion.div key={benefit.title} whileHover={{ y: -6 }} className='rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]'>
                  <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#ff4d2d]/10 text-[#ff4d2d]'>{benefit.icon}</div>
                  <h3 className='text-xl font-semibold text-slate-900'>{benefit.title}</h3>
                  <p className='mt-3 text-sm leading-6 text-slate-600'>{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='space-y-6 rounded-[40px] bg-[#111827] p-10 text-white shadow-[0_28px_80px_rgba(15,23,42,0.24)]'>
              <p className='text-sm uppercase tracking-[0.35em] text-[#fca5a5]'>Download the app</p>
              <h2 className='text-3xl font-semibold'>Your favorite food experience, anytime.</h2>
              <p className='max-w-xl text-base leading-7 text-slate-300'>Get the app to unlock new offers, faster checkout, and live order tracking from the palm of your hand.</p>
              <div className='grid gap-4 sm:grid-cols-2'>
                <Button className='w-full bg-gray text-slate-900 '>App Store</Button>
                <Button variant='ghost' className='w-full border border-white text-white hover:bg-white/10'>Google Play</Button>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }} className='relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)]'>
              <div className='absolute -right-10 top-10 h-32 w-32 rounded-full bg-[#ff4d2d]/10 blur-3xl' />
              <div className='h-full w-full rounded-[32px] bg-[#f8fafc] p-6'>
                <div className='flex h-24 w-full items-center justify-between rounded-[32px] border border-slate-200 bg-white p-4'>
                  <div>
                    <p className='text-sm uppercase tracking-[0.35em] text-slate-500'>QuickBite app</p>
                    <p className='mt-2 text-xl font-semibold text-slate-900'>Order faster with one tap.</p>
                  </div>
                  <div className='flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                    <FaMapMarkerAlt className='h-6 w-6' />
                  </div>
                </div>
                <div className='mt-8 grid gap-4'>
                  <div className='rounded-[28px] border border-slate-200 bg-white p-5'>
                    <p className='text-sm font-semibold text-slate-900'>Live order tracking</p>
                    <p className='mt-2 text-sm text-slate-500'>Watch your delivery move in real time.</p>
                  </div>
                  <div className='rounded-[28px] border border-slate-200 bg-white p-5'>
                    <p className='text-sm font-semibold text-slate-900'>Exclusive rewards</p>
                    <p className='mt-2 text-sm text-slate-500'>Earn points every time you order.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id='contact' className='mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8'>
          <div className='rounded-[40px] border border-slate-200 bg-white p-10 shadow-[0_28px_80px_rgba(15,23,42,0.08)]'>
            <div className='grid gap-10 lg:grid-cols-[1.2fr_0.8fr]'>
              <div>
                <p className='text-sm uppercase tracking-[0.35em] text-[#ff4d2d]'>Stay in touch</p>
                <h2 className='mt-3 text-3xl font-semibold text-slate-900'>Subscribe for exclusive deals and new menu drops.</h2>
                <p className='mt-4 text-base leading-7 text-slate-600'>Get the freshest offers delivered to your inbox and be the first to know about limited-time meals.</p>
              </div>
              <div className='rounded-[32px] bg-[#f8fafc] p-6'>
                <label className='mb-3 block text-sm font-semibold text-slate-900'>Email address</label>
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <input type='email' placeholder='you@example.com' className='w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none' />
                  <Button className='w-full sm:w-auto' onClick={handleLogin}>Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-slate-200 bg-white/95 px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl space-y-10 lg:grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:items-start lg:gap-10'>
          <div className='space-y-4'>
            <div className='inline-flex items-center gap-2 rounded-full bg-[#ff4d2d]/10 px-4 py-2 text-sm font-semibold text-[#bb3219]'>
              QuickBite
            </div>
            <p className='max-w-sm text-sm leading-6 text-slate-600'>Premium food delivery for modern customers. Taste the difference with fresh menus, fast delivery, and beautiful design.</p>
            <p className='text-sm text-slate-500'>© {new Date().getFullYear()} QuickBite. All rights reserved.</p>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-slate-900'>Quick Links</h3>
            <ul className='mt-4 space-y-2 text-sm text-slate-600'>
              <li><a href='#home' className='transition hover:text-[#ff4d2d]'>Home</a></li>
              <li><a href='#features' className='transition hover:text-[#ff4d2d]'>Features</a></li>
              <li><a href='#popular-foods' className='transition hover:text-[#ff4d2d]'>Popular Foods</a></li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-slate-900'>Resources</h3>
            <ul className='mt-4 space-y-2 text-sm text-slate-600'>
              <li><a href='#about' className='transition hover:text-[#ff4d2d]'>About</a></li>
              <li><a href='#contact' className='transition hover:text-[#ff4d2d]'>Contact</a></li>
              <li><button onClick={handleLogin} className='transition text-left text-sm text-slate-600 hover:text-[#ff4d2d]'>Sign In</button></li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold text-slate-900'>Download</h3>
            <div className='mt-4 grid gap-3'>
              <Button variant='secondary' className='w-full justify-start gap-3'>
                <FaApple className='h-5 w-5' /> App Store
              </Button>
              <Button variant='ghost' className='w-full justify-start gap-3 border border-slate-200 text-slate-700'>
                <FaGooglePlay className='h-5 w-5' /> Google Play
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
