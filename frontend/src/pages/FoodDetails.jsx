import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { FaChevronLeft, FaClock, FaHeart, FaLeaf, FaRegHeart, FaStar, FaUtensils } from 'react-icons/fa'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { serverUrl } from '../config.js'
import { addToCart } from '../redux/userSlice'
import { getRoleHome } from '../utils/navigation'

const sampleReviews = [
  {
    author: 'Aarav S.',
    rating: 5,
    message: 'Perfectly spiced and delivered hot. The portion size was generous and the delivery was quick.',
    date: '2 days ago',
  },
  {
    author: 'Nina K.',
    rating: 4,
    message: 'Loved the presentation and the crisp crust. Would order again for a weekend treat.',
    date: '5 days ago',
  },
  {
    author: 'Rahul P.',
    rating: 4,
    message: 'Great flavors, especially the garlic sauce. The item arrived on time and tasted fresh.',
    date: '1 week ago',
  },
]

const sampleNutrition = [
  { label: 'Calories', value: '430 kcal' },
  { label: 'Carbs', value: '48 g' },
  { label: 'Protein', value: '18 g' },
  { label: 'Fat', value: '16 g' },
  { label: 'Fiber', value: '5 g' },
]

const sampleIngredients = ['Mozzarella cheese', 'Tomato sauce', 'Olive oil', 'Fresh basil', 'Seasoned crust', 'Garlic flakes']

function FoodDetails() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentCity } = useSelector(state => state.user)
  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeImage, setActiveImage] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const fetchItem = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`, { withCredentials: true })
      setItem(result.data)
      setActiveImage(result.data.image)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchRelatedItems = async (shopId) => {
    if (!shopId) return
    try {
      const response = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
      const items = response.data.items || []
      const filtered = items.filter((related) => related._id !== itemId)
      setRelatedItems(filtered.slice(0, 4))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchItem()
  }, [itemId])

  useEffect(() => {
    if (item?.shop) {
      fetchRelatedItems(item.shop)
    }
  }, [item])

  const handleAddToCart = () => {
    setIsAdding(true)
    dispatch(
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        quantity,
        foodType: item.foodType,
      })
    )
    setTimeout(() => {
      setIsAdding(false)
    }, 450)
  }

  const deliveryEstimate = useMemo(() => {
    if (!item) return 'Calculating...'
    return item.deliveryTime || item.delivery || '25-35 min'
  }, [item])

  const nutrition = item?.nutrition || sampleNutrition
  const ingredients = item?.ingredients || sampleIngredients

  const galleryImages = useMemo(() => {
    if (!item) return []
    return [item.image, item.image, item.image]
  }, [item])

  return (
    <div className='min-h-screen bg-[#f8fafc] text-slate-900'>
      <div className='mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8'>
        <button
          className='mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
          onClick={() => navigate(window.history.length > 1 ? -1 : getRoleHome(userData))}
        >
          <FaChevronLeft /> Back to menu
        </button>

        {item ? (
          <div className='grid gap-8 lg:grid-cols-[1.5fr_0.9fr]'>
            <div className='space-y-8'>
              <Card className='overflow-hidden rounded-[32px] p-0 shadow-[0_40px_120px_rgba(15,23,42,0.08)]'>
                <div className='grid gap-6 lg:grid-cols-[1.4fr_0.6fr]'>
                  <div className='relative overflow-hidden bg-slate-950'>
                    <img loading="lazy" src={activeImage} alt={item.name} className='h-full w-full object-cover' />
                    <div className='absolute left-4 top-4 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm'>
                      {item.foodType === 'veg' ? <FaLeaf className='inline-block text-emerald-600' /> : <FaUtensils className='inline-block text-rose-600' />} {item.foodType === 'veg' ? 'Vegetarian' : 'Non-veg'}
                    </div>
                  </div>
                  <div className='space-y-4 rounded-[32px] border border-slate-200 bg-white p-5'>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between gap-4'>
                        <div>
                          <p className='text-sm uppercase tracking-[0.3em] text-[#ff4d2d]'>Featured item</p>
                          <h1 className='mt-3 text-3xl font-semibold sm:text-4xl'>{item.name}</h1>
                        </div>
                        <div className='rounded-full bg-[#ff4d2d] px-4 py-2 text-sm font-semibold text-white shadow-sm'>₹{item.price}</div>
                      </div>
                      <p className='text-sm leading-7 text-slate-600'>{item.description || 'A premium menu item crafted to deliver rich flavor, made fresh with high-quality ingredients and served with a modern twist.'}</p>
                    </div>

                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div className='rounded-3xl bg-slate-50 p-4'>
                        <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Delivery estimate</p>
                        <p className='mt-3 text-lg font-semibold text-slate-900'>{deliveryEstimate}</p>
                        <p className='mt-2 text-sm text-slate-500'>Free delivery on orders over ₹299</p>
                      </div>
                      <div className='rounded-3xl bg-slate-50 p-4'>
                        <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Ratings</p>
                        <div className='mt-3 flex items-center gap-2'>
                          <div className='inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-3 py-2 text-sm font-semibold text-[#c2410c]'>
                            <FaStar /> {item.rating?.average?.toFixed(1) || 0}
                          </div>
                          <span className='text-sm text-slate-500'>({item.rating?.count || 0} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className='grid gap-3'>
                      <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Gallery</p>
                      <div className='grid gap-3 sm:grid-cols-3'>
                        {galleryImages.map((galleryUrl, index) => (
                          <button
                            key={index}
                            type='button'
                            onClick={() => setActiveImage(galleryUrl)}
                            className={`overflow-hidden rounded-[24px] border ${activeImage === galleryUrl ? 'border-[#ff4d2d]' : 'border-slate-200'} bg-white transition hover:border-[#ff4d2d]`}
                          >
                            <img loading="lazy" src={galleryUrl} alt={`${item.name} gallery ${index + 1}`} className='h-24 w-full object-cover' />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
                <Card className='rounded-[32px] p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#ff4d2d]'>Nutrition</p>
                      <h2 className='mt-3 text-2xl font-semibold text-slate-900'>Fuel for your day</h2>
                    </div>
                    <span className='rounded-3xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700'>Balanced</span>
                  </div>
                  <div className='mt-6 grid gap-3 sm:grid-cols-3'>
                    {nutrition.map((nutrient) => (
                      <div key={nutrient.label} className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                        <p className='text-sm font-semibold text-slate-900'>{nutrient.value}</p>
                        <p className='mt-2 text-xs uppercase tracking-[0.25em] text-slate-500'>{nutrient.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className='rounded-[32px] p-6'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#ff4d2d]'>Ingredients</p>
                      <h2 className='mt-3 text-2xl font-semibold text-slate-900'>What’s inside</h2>
                    </div>
                    <FaLeaf className='text-2xl text-emerald-500' />
                  </div>
                  <ul className='mt-6 grid gap-3 sm:grid-cols-2'>
                    {ingredients.map((ingredient) => (
                      <li key={ingredient} className='rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700'>{ingredient}</li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card className='rounded-[32px] p-6'>
                <div className='flex items-center justify-between gap-2'>
                  <div>
                    <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#ff4d2d]'>Reviews</p>
                    <h2 className='mt-3 text-2xl font-semibold text-slate-900'>What customers say</h2>
                  </div>
                  <span className='rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700'>{sampleReviews.length}+ reviews</span>
                </div>
                <div className='mt-6 space-y-4'>
                  {sampleReviews.map((review) => (
                    <div key={review.author} className='rounded-[28px] border border-slate-200 bg-slate-50 p-5'>
                      <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                          <p className='text-base font-semibold text-slate-900'>{review.author}</p>
                          <p className='text-sm text-slate-500'>{review.date}</p>
                        </div>
                        <div className='inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm'>
                          <FaStar className='text-amber-400' /> {review.rating}.0
                        </div>
                      </div>
                      <p className='mt-4 text-sm leading-7 text-slate-700'>{review.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className='rounded-[32px] bg-white p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]'>
            <p className='text-center text-slate-600'>Loading menu item details…</p>
          </div>
        )}

        {item && (
          <aside className='space-y-6'>
            <div className='rounded-[32px] bg-white p-6 shadow-[0_40px_120px_rgba(15,23,42,0.08)]'>
              <div className='flex flex-col gap-4'>
                <div className='rounded-[28px] border border-slate-200 bg-[#ff4d2d]/5 p-4 text-sm font-semibold text-[#b91c1c]'>
                  Estimated delivery in <span className='font-bold text-slate-900'>{deliveryEstimate}</span>
                </div>
                <div className='rounded-[28px] border border-slate-200 bg-slate-50 p-4'>
                  <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>Quantity</p>
                  <div className='mt-4 flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]'
                    >
                      -
                    </button>
                    <span className='min-w-[58px] text-center text-xl font-semibold'>{quantity}</span>
                    <button
                      type='button'
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]'
                    >
                      +
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  animate={isAdding ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  type='button'
                  onClick={handleAddToCart}
                  className='inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff4d2d] px-6 py-4 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(255,77,45,0.25)] transition hover:bg-[#e64526]'
                >
                  <span>{isAdding ? 'Adding…' : 'Add to cart'}</span>
                  <span className='text-sm font-normal'>₹{item.price * quantity}</span>
                </motion.button>

                <button
                  type='button'
                  onClick={() => setWishlisted((prev) => !prev)}
                  className='inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:border-[#ff4d2d] hover:text-[#ff4d2d]'
                >
                  {wishlisted ? <FaHeart className='text-rose-500' /> : <FaRegHeart />}
                  {wishlisted ? 'Added to wishlist' : 'Add to wishlist'}
                </button>
              </div>
            </div>

            <Card className='rounded-[32px] p-6'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#ff4d2d]'>Related items</p>
                  <h2 className='mt-3 text-2xl font-semibold text-slate-900'>Pairs that match</h2>
                </div>
                <span className='text-sm text-slate-500'>{relatedItems.length} items</span>
              </div>
              <div className='mt-6 grid gap-4'>
                {relatedItems.map((related) => (
                  <div key={related._id} className='group flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:bg-white'>
                    <img loading="lazy" src={related.image} alt={related.name} className='h-20 w-20 rounded-3xl object-cover' />
                    <div className='flex-1'>
                      <p className='font-semibold text-slate-900'>{related.name}</p>
                      <p className='text-sm text-slate-500'>{related.category || 'Chef special'}</p>
                    </div>
                    <p className='text-sm font-semibold text-slate-900'>₹{related.price}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className='rounded-[32px] p-6'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#ff4d2d]'>Frequently bought together</p>
                  <h2 className='mt-3 text-2xl font-semibold text-slate-900'>Bundle & save</h2>
                </div>
              </div>
              <div className='mt-6 space-y-4'>
                {relatedItems.slice(0, 2).map((combo) => (
                  <div key={combo._id} className='rounded-[28px] border border-slate-200 bg-slate-50 p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='font-semibold text-slate-900'>{combo.name}</p>
                        <p className='text-sm text-slate-500'>Best as a side or sharing plate</p>
                      </div>
                      <p className='font-semibold text-slate-900'>₹{combo.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        )}
      </div>
    </div>
  )
}

export default FoodDetails
