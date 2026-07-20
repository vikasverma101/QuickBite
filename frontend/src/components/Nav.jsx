import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaBell, FaLocationDot, FaPlus } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from 'react-icons/rx'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config.js'
import { setSearchItems, setSearchQuery, setSearchFilters, setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'
import { categories } from '../category'

function Nav() {
  const { userData, currentCity, cartItems, searchFilters } = useSelector(state => state.user)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [query, setQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window === 'undefined') return []
    return JSON.parse(window.localStorage.getItem('quickbite-search-history') || '[]')
  })
  const [searchLoading, setSearchLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const popularSearches = ['Veg Fries', 'Burger', 'Sushi', 'Vegan', 'Desserts', 'Fast Food']
  const trendingSearches = ['Cheese Burst', 'Paneer Tikka', 'Chocolate Lava Cake', 'Mango Lassi']
  const cuisineOptions = ['All', ...categories.map((cate) => cate.category)]

  const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi')
    return text.split(regex).map((part, index) => (
      regex.test(part) ? (
        <span key={`match-${index}`} className='text-[#ff4d2d] font-semibold'>
          {part}
        </span>
      ) : (
        <span key={`plain-${index}`}>
          {part}
        </span>
      )
    ))
  }

  const saveSearchHistory = (term) => {
    const normalized = term.trim()
    if (!normalized) return
    const nextHistory = [normalized, ...searchHistory.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 6)
    setSearchHistory(nextHistory)
    window.localStorage.setItem('quickbite-search-history', JSON.stringify(nextHistory))
  }

  const filteredHistory = useMemo(() => {
    if (!query.trim()) return searchHistory
    return searchHistory.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
  }, [query, searchHistory])

  const filteredPopular = useMemo(() => popularSearches.filter((item) => item.toLowerCase().includes(query.toLowerCase())), [query])
  const filteredTrending = useMemo(() => trendingSearches.filter((item) => item.toLowerCase().includes(query.toLowerCase())), [query])

  const suggestionItems = useMemo(() => {
    if (query.trim()) {
      return [...new Set([...filteredHistory, ...filteredPopular, ...filteredTrending])].slice(0, 7)
    }
    return searchHistory.length ? searchHistory.slice(0, 5) : popularSearches.slice(0, 5)
  }, [query, filteredHistory, filteredPopular, filteredTrending, searchHistory])

  const applyFilters = (items, filters) => {
    const filtered = items.filter((item) => {
      if (filters.veg && !filters.nonVeg && item.foodType !== 'veg') return false
      if (filters.nonVeg && !filters.veg && item.foodType !== 'non veg') return false
      if (filters.minRating > 0 && (item.rating?.average || 0) < filters.minRating) return false
      if (filters.offers && !item.discount && !item.offer) return false
      if (filters.cuisine && filters.cuisine !== 'All' && item.category !== filters.cuisine) return false
      if (filters.delivery === 'fast') {
        const match = (item.deliveryTime || item.delivery || '').match(/\d+/)
        const minutes = match ? Number(match[0]) : 999
        if (minutes > 35) return false
      }
      if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) return false
      return true
    })

    if (filters.sort === 'price-low') {
      return filtered.sort((a, b) => a.price - b.price)
    }
    if (filters.sort === 'price-high') {
      return filtered.sort((a, b) => b.price - a.price)
    }
    if (filters.sort === 'rating') {
      return filtered.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    }
    return filtered
  }

  const handleSearchItems = useCallback(async (searchText) => {
    if (!searchText.trim()) return
    setSearchLoading(true)
    try {
      const cityParam = currentCity ? `&city=${encodeURIComponent(currentCity)}` : ''
      const result = await axios.get(`${serverUrl}/api/item/search-items?query=${encodeURIComponent(searchText)}${cityParam}`, { withCredentials: true })
      const filteredResult = applyFilters(result.data || [], searchFilters)
      dispatch(setSearchItems(filteredResult))
      dispatch(setSearchQuery(searchText))
      saveSearchHistory(searchText)
    } catch (error) {
      console.log(error)
    } finally {
      setSearchLoading(false)
    }
  }, [currentCity, dispatch, searchFilters, searchHistory])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearchItems(query)
      } else {
        dispatch(setSearchQuery(''))
        dispatch(setSearchItems(null))
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [query, handleSearchItems, dispatch])

  useEffect(() => {
    if (query.trim()) {
      handleSearchItems(query)
    }
  }, [searchFilters, query, handleSearchItems])

  const handleSuggestionClick = (term) => {
    setQuery(term)
    handleSearchItems(term)
    setIsSearchFocused(false)
  }

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
    } catch (error) {
      console.warn('Logout failed', error)
    }
    dispatch(setUserData(null))
    dispatch(setMyShopData(null))
    navigate('/')
  }

  const handleFilterChange = (update) => {
    dispatch(setSearchFilters(update))
  }

  const profileInitial = userData?.fullName?.trim().charAt(0).toUpperCase() || 'Q'
  const notificationCount = 2

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-3'>
          <button className='inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff4d2d]/10 text-[#ff4d2d] transition hover:bg-[#ff4d2d]/15 md:hidden' onClick={() => setShowMobileMenu(true)}>
            <FiMenu size={20} />
          </button>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-slate-900'>QuickBite</h1>
            <p className='text-xs text-slate-500'>Order faster, track smarter</p>
          </div>
        </div>

        <div className='hidden flex-1 items-center justify-center md:flex'>
          {userData.role === 'user' ? (
            <div className='relative flex w-full max-w-2xl items-center rounded-3xl border border-slate-200 bg-slate-50/90 px-4 py-2 shadow-sm'>
              <FaLocationDot className='mr-3 text-[#ff4d2d]' />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search food in ${currentCity || 'your city'}...`}
                className='w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
              />
              {query ? (
                <button onClick={() => setQuery('')} className='rounded-full p-2 text-slate-400 transition hover:text-slate-600'>
                  <RxCross2 size={18} />
                </button>
              ) : (
                <IoIosSearch className='text-slate-400' size={20} />
              )}
            </div>
          ) : (
            <div className='flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50/90 px-4 py-2 text-sm text-slate-600 shadow-sm'>
              <p className='font-medium'>{userData.role === 'owner' ? 'Owner Dashboard' : 'Delivery Hub'}</p>
            </div>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden rounded-2xl bg-[#ff4d2d]/10 px-3 py-2 text-sm font-medium text-[#ff4d2d] md:flex'>
            {currentCity || 'City unavailable'}
          </div>

          <button className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 md:hidden' onClick={() => setShowSearch((prev) => !prev)}>
            <IoIosSearch size={20} />
          </button>

          {userData.role === 'owner' && (
            <button className='hidden items-center gap-2 rounded-2xl bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e33f29] md:flex' onClick={() => navigate('/add-item')}>
              <FaPlus size={16} />
              Add Food Item
            </button>
          )}

          {userData.role === 'user' && (
            <button className='relative hidden h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 md:flex' onClick={() => navigate('/cart')}>
              <FiShoppingCart size={20} />
              <span className='absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff4d2d] px-1.5 text-[11px] font-semibold text-white'>{cartItems.length}</span>
            </button>
          )}

          <div className='relative'>
            <button className='relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200' onClick={() => setShowNotifications((prev) => !prev)}>
              <FaBell size={18} />
              <span className='absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff4d2d] px-1.5 text-[10px] font-semibold text-white'>{notificationCount}</span>
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className='absolute right-0 mt-3 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)]'>
                  <div className='mb-3 flex items-center justify-between'>
                    <span className='text-sm font-semibold text-slate-900'>Notifications</span>
                    <span className='text-xs text-slate-400'>Live</span>
                  </div>
                  <div className='space-y-3'>
                    <div className='rounded-3xl bg-slate-50 p-3'>
                      <p className='text-sm font-medium text-slate-900'>New order available</p>
                      <p className='text-xs text-slate-500'>A fresh delivery request is ready for assignment.</p>
                    </div>
                    <div className='rounded-3xl bg-slate-50 p-3'>
                      <p className='text-sm font-medium text-slate-900'>Order update</p>
                      <p className='text-xs text-slate-500'>Your latest order status has been refreshed.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className='relative'>
            <button className='flex h-11 min-w-[44px] items-center justify-center rounded-2xl bg-[#ff4d2d] px-3 text-sm font-semibold text-white shadow-lg shadow-[#ff4d2d]/20 transition hover:bg-[#e64526] sm:min-w-[48px] md:gap-2 md:px-4' onClick={() => setShowInfo((prev) => !prev)}>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/15 text-sm font-bold tracking-wide text-white shadow-sm sm:h-8 sm:w-8 sm:text-base'>{profileInitial}</span>
              <span className='hidden max-w-[120px] truncate md:inline-flex text-sm'>{userData.fullName}</span>
            </button>
            <AnimatePresence>
              {showInfo && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className='absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)]'>
                  <div className='mb-4 flex items-center gap-3 rounded-3xl bg-slate-50 px-3 py-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff4d2d] text-sm font-semibold text-white'>{profileInitial}</div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900'>{userData.fullName}</p>
                      <p className='text-xs text-slate-500'>{userData.role}</p>
                    </div>
                  </div>
                  <button className='w-full rounded-3xl bg-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-200' onClick={() => navigate('/my-orders')}>
                    My Orders
                  </button>
                  <button className='mt-2 w-full rounded-3xl bg-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-200' onClick={handleLogOut}>
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {userData.role === 'user' && (isSearchFocused || query.trim()) && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className='hidden border-t border-slate-200/80 bg-white/95 px-4 pb-4 backdrop-blur-xl md:block'>
            <div className='mx-auto flex max-w-7xl flex-col gap-4 py-4'>
              <div className='grid gap-4 lg:grid-cols-[1.1fr_0.9fr]'>
                <div className='rounded-[32px] border border-slate-200 bg-slate-50 p-4 shadow-sm'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <button onClick={() => handleFilterChange({ veg: !searchFilters.veg })} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${searchFilters.veg ? 'bg-[#e9f7ef] text-emerald-700 border border-emerald-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#ff4d2d]/60'}`}>
                      Veg
                    </button>
                    <button onClick={() => handleFilterChange({ nonVeg: !searchFilters.nonVeg })} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${searchFilters.nonVeg ? 'bg-[#fff1f0] text-rose-700 border border-rose-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#ff4d2d]/60'}`}>
                      Non-Veg
                    </button>
                    <button onClick={() => handleFilterChange({ offers: !searchFilters.offers })} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${searchFilters.offers ? 'bg-[#fff7ed] text-[#b45309] border border-amber-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#ff4d2d]/60'}`}>
                      Offers
                    </button>
                    <button onClick={() => handleFilterChange({ delivery: searchFilters.delivery === 'fast' ? 'any' : 'fast' })} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${searchFilters.delivery === 'fast' ? 'bg-[#eff6ff] text-[#2563eb] border border-sky-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#ff4d2d]/60'}`}>
                      Fast Delivery
                    </button>
                  </div>
                  <div className='mt-4 space-y-3'>
                    <div className='rounded-3xl bg-white p-3 ring-1 ring-slate-200'>
                      <label className='block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Cuisine</label>
                      <select value={searchFilters.cuisine} onChange={(e) => handleFilterChange({ cuisine: e.target.value })} className='mt-2 w-full rounded-3xl border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none'>
                        {cuisineOptions.map((option) => (
                          <option value={option} key={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div className='rounded-3xl bg-white p-3 ring-1 ring-slate-200'>
                        <label className='block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Rating</label>
                        <div className='mt-3 flex flex-wrap gap-2'>
                          {[0, 3, 4, 4.5].map((rating) => (
                            <button key={rating} onClick={() => handleFilterChange({ minRating: rating })} className={`rounded-full px-3 py-2 text-sm font-semibold transition ${searchFilters.minRating === rating ? 'bg-[#eff6ff] text-[#2563eb] border border-sky-200' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#ff4d2d]/60'}`}>
                              {rating === 0 ? 'Any' : `${rating}+ ★`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className='rounded-3xl bg-white p-3 ring-1 ring-slate-200'>
                        <label className='block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Max Price</label>
                        <div className='mt-3'>
                          <div className='flex items-center justify-between text-sm text-slate-500'>
                            <span>Up to</span>
                            <span className='font-semibold text-slate-900'>₹{searchFilters.priceRange[1]}</span>
                          </div>
                          <input value={searchFilters.priceRange[1]} type='range' min='0' max='1000' step='50' onChange={(e) => handleFilterChange({ priceRange: [0, Number(e.target.value)] })} className='mt-3 w-full accent-[#ff4d2d]' />
                        </div>
                      </div>
                    </div>

                    <div className='rounded-3xl bg-white p-3 ring-1 ring-slate-200'>
                      <label className='block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>Sort</label>
                      <select value={searchFilters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })} className='mt-2 w-full rounded-3xl border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none'>
                        <option value='relevance'>Relevance</option>
                        <option value='price-low'>Price: Low to High</option>
                        <option value='price-high'>Price: High to Low</option>
                        <option value='rating'>Top Rated</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='grid gap-3'>
                  <div className='rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-semibold text-slate-900'>Search tips</p>
                        <p className='text-xs text-slate-500'>Tap a suggestion to search faster.</p>
                      </div>
                      {searchLoading && <span className='text-xs text-slate-500'>Searching...</span>}
                    </div>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      {suggestionItems.map((suggestion) => (
                        <button key={suggestion} onClick={() => handleSuggestionClick(suggestion)} className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]'>
                          {highlightMatch(suggestion, query)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='rounded-[32px] border border-slate-200 bg-slate-50 p-4 shadow-sm'>
                    <div className='flex items-center justify-between gap-3'>
                      <p className='text-sm font-semibold text-slate-900'>Popular searches</p>
                      <span className='text-xs text-slate-500'>Quick picks</span>
                    </div>
                    <div className='mt-4 grid gap-2'>
                      {popularSearches.slice(0, 4).map((term) => (
                        <button key={term} onClick={() => handleSuggestionClick(term)} className='text-left rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d]'>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && userData.role === 'user' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className='border-t border-slate-200/80 bg-white/90 px-4 pb-4 backdrop-blur-xl md:hidden'>
            <div className='flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3'>
              <FaLocationDot className='text-[#ff4d2d]' />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search food in ${currentCity || 'your city'}...`} className='w-full bg-transparent text-sm text-slate-700 outline-none' />
              {query ? (
                <button onClick={() => setQuery('')} className='rounded-full p-2 text-slate-400 transition hover:text-slate-600'>
                  <RxCross2 size={18} />
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm'>
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }} className='h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl'>
              <div className='mb-7 flex items-center justify-between'>
                <div>
                  <p className='text-xl font-semibold text-slate-900'>QuickBite</p>
                  <p className='text-sm text-slate-500'>Responsive menu</p>
                </div>
                <button className='inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700' onClick={() => setShowMobileMenu(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className='space-y-4'>
                {userData.role === 'user' && (
                  <button className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100' onClick={() => { navigate('/cart'); setShowMobileMenu(false) }}>
                    Cart ({cartItems.length})
                  </button>
                )}
                <button className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100' onClick={() => { navigate('/my-orders'); setShowMobileMenu(false) }}>
                  My Orders
                </button>
                {userData.role === 'owner' && (
                  <button className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100' onClick={() => { navigate('/add-item'); setShowMobileMenu(false) }}>
                    Add Food Item
                  </button>
                )}
                <button className='w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100' onClick={() => { handleLogOut(); setShowMobileMenu(false) }}>
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
export default Nav
