import React, { useEffect, useMemo, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoSearchOutline, IoLocationSharp } from 'react-icons/io5'
import { TbCurrentLocation } from 'react-icons/tb'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import 'leaflet/dist/leaflet.css'
import { setAddress, setLocation } from '../redux/mapSlice'
import { MdDeliveryDining } from 'react-icons/md'
import { FaCreditCard } from 'react-icons/fa'
import axios from 'axios'
import { FaMobileScreenButton } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config.js'
import { addMyOrder } from '../redux/userSlice'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { pageShell } from '../designTokens'
import { useToast } from '../components/ToastProvider.jsx'
import { getRoleHome } from '../utils/navigation'

function RecenterMap({ location }) {
  const map = useMap()
  if (location.lat && location.lon) {
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null

}

const availableCoupons = [
  { code: 'QUICK10', label: '10% off on orders above ₹300', discount: 0.1, minOrder: 300 },
  { code: 'SAVE50', label: '₹50 off on orders above ₹500', discount: 50, minOrder: 500 },
  { code: 'FREESHIP', label: 'Free delivery on orders above ₹350', discount: 40, minOrder: 350, isDeliveryOnly: true },
]

function CheckOut() {
  const { location, address } = useSelector((state) => state.map)
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user)
  const [addressInput, setAddressInput] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [selectedAddressId, setSelectedAddressId] = useState('current')
  const [deliveryInstructions, setDeliveryInstructions] = useState('Leave it at the door if no one is home')
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40
  const taxAmount = Math.round((totalAmount + deliveryFee) * 0.05)
  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.isDeliveryOnly) return deliveryFee
    return selectedCoupon.discount < 1
      ? Math.round(totalAmount * selectedCoupon.discount)
      : selectedCoupon.discount
  }, [selectedCoupon, totalAmount, deliveryFee])
  const totalPayable = totalAmount + deliveryFee + taxAmount - couponDiscount
  const estimatedDelivery = `${20 + Math.floor(deliveryFee === 0 ? 0 : 5)}-${30 + Math.floor(totalAmount / 250)} min`

  const addressOptions = useMemo(() => {
    const saved = Array.isArray(userData?.savedAddresses)
      ? userData.savedAddresses.map((item, index) => ({
          id: item._id || `saved-${index}`,
          label: item.label || 'Saved Address',
          text: item.text || item.address || item.fullAddress || '',
          latitude: item.latitude,
          longitude: item.longitude,
        }))
      : []

    const fallback = {
      id: 'current',
      label: 'Current location',
      text: address || userData?.address || 'Use your current delivery address',
      latitude: location?.lat,
      longitude: location?.lon,
    }

    return [fallback, ...saved]
  }, [userData?.savedAddresses, address, location?.lat, location?.lon, userData?.address])






  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }
  const getCurrentLocation = () => {
      const latitude=userData.location.coordinates[1]
      const longitude=userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
   

  }

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      )
      dispatch(
        setAddress(
          result?.data?.results?.[0]?.address_line2 ||
            result?.data?.results?.[0]?.address_line1 ||
            address
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    if (!addressInput.trim()) {
      setCouponError('Please enter an address to search.')
      return
    }
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
      )
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
      setCouponError('')
    } catch (error) {
      console.log(error)
      setCouponError('Unable to locate the address. Try a different landmark.')
    }
  }

  const handleSelectAddress = (item) => {
    setSelectedAddressId(item.id)
    setAddressInput(item.text)
    if (item.latitude && item.longitude) {
      dispatch(setLocation({ lat: item.latitude, lon: item.longitude }))
    }
  }

  const applyCoupon = (coupon) => {
    if (coupon.minOrder && totalAmount < coupon.minOrder) {
      setCouponError(`This offer unlocks at ₹${coupon.minOrder}.`)
      return
    }
    setSelectedCoupon(coupon)
    setCouponError('')
    toast.pushToast(`${coupon.code} applied successfully`, 'success')
  }

  const handlePlaceOrder = async () => {
    if (!addressInput.trim()) {
      toast.pushToast('Please provide a delivery address before placing your order.', 'error')
      return
    }
    if (!location?.lat || !location?.lon) {
      toast.pushToast('Please select a valid delivery location on the map.', 'error')
      return
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location?.lat,
            longitude: location?.lon,
            instructions: deliveryInstructions,
          },
          totalAmount: totalPayable,
          cartItems,
        },
        { withCredentials: true }
      )

      if (paymentMethod === 'cod') {
        dispatch(addMyOrder(result.data))
        toast.pushToast('Order placed successfully! Tracking details are available in My Orders.', 'success')
        navigate('/order-placed')
      } else {
        toast.pushToast('Opening secure payment window...', 'success')
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorpayWindow(orderId, razorOrder)
      }
    } catch (error) {
      console.log(error)
      toast.pushToast('Something went wrong. Please try again.', 'error')
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{

  const options={
 key:import.meta.env.VITE_RAZORPAY_KEY_ID,
 amount:razorOrder.amount,
 currency:'INR',
 name:"QuickBite",
 description:"Food Delivery Website",
 order_id:razorOrder.id,
 handler:async function (response) {
  try {
    const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
      razorpay_payment_id:response.razorpay_payment_id,
      orderId
    },{withCredentials:true})
        dispatch(addMyOrder(result.data))
      navigate("/order-placed")
  } catch (error) {
    console.log(error)
  }
 }
  }

  const rzp=new window.Razorpay(options)
  rzp.open()


}


  useEffect(() => {
    setAddressInput(address)
  }, [address])
  return (
    <div className={`${pageShell} flex min-h-screen items-center justify-center p-6`}>
      <div className='absolute left-[20px] top-[20px] z-[10] cursor-pointer' onClick={() => navigate(getRoleHome(userData))}>
        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
      </div>
      <div className='w-full max-w-[1200px] space-y-6'>
        <div className='grid gap-6 xl:grid-cols-[1.5fr_1fr]'>
          <Card className='space-y-6 border-0 p-6'>
            <div>
              <h1 className='text-2xl font-semibold text-slate-900'>Checkout</h1>
              <p className='mt-2 text-sm text-slate-600'>Review your order, choose your delivery preference, and complete the secure payment flow.</p>
            </div>

            <section className='space-y-4'>
              <div className='flex items-center gap-3'>
                <IoLocationSharp className='text-2xl text-[#ff4d2d]' />
                <h2 className='text-lg font-semibold text-slate-800'>Delivery Address</h2>
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                {addressOptions.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleSelectAddress(item)}
                    className={`rounded-3xl border p-4 text-left transition ${selectedAddressId === item.id ? 'border-[#ff4d2d] bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <p className='text-sm font-semibold text-slate-900'>{item.label}</p>
                    <p className='mt-2 text-sm text-slate-600'>{item.text || 'Select an address to update'}</p>
                  </button>
                ))}
              </div>

              <div className='grid gap-3 sm:grid-cols-[1.7fr_0.9fr]'>
                <input
                  type='text'
                  className='rounded-2xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/15'
                  placeholder='Enter or update your delivery address'
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
                <button className='rounded-2xl bg-[#ff4d2d] px-4 text-white transition hover:bg-[#e64526]' onClick={getLatLngByAddress}>Search</button>
              </div>
              {couponError ? <p className='text-sm text-rose-600'>{couponError}</p> : null}
            </section>

            <section className='space-y-4'>
              <div className='flex items-center gap-3'>
                <FaMobileScreenButton className='text-2xl text-slate-700' />
                <h2 className='text-lg font-semibold text-slate-800'>Delivery Instructions</h2>
              </div>
              <textarea
                rows={3}
                className='w-full resize-none rounded-3xl border border-slate-200 p-4 text-sm text-slate-700 outline-none focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/15'
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder='Tell the rider anything they should know when delivering your order'
              />
            </section>

            <section className='space-y-4'>
              <div className='flex items-center gap-3'>
                <MdDeliveryDining className='text-2xl text-green-600' />
                <h2 className='text-lg font-semibold text-slate-800'>Payment Method</h2>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <button
                  type='button'
                  onClick={() => setPaymentMethod('cod')}
                  className={`rounded-3xl border p-4 text-left transition ${paymentMethod === 'cod' ? 'border-[#ff4d2d] bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <p className='font-semibold text-slate-900'>Cash On Delivery</p>
                  <p className='mt-2 text-sm text-slate-500'>Pay the rider when food arrives</p>
                </button>
                <button
                  type='button'
                  onClick={() => setPaymentMethod('online')}
                  className={`rounded-3xl border p-4 text-left transition ${paymentMethod === 'online' ? 'border-[#ff4d2d] bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <p className='font-semibold text-slate-900'>UPI / Card / Wallet</p>
                  <p className='mt-2 text-sm text-slate-500'>Secure online checkout</p>
                </button>
              </div>
            </section>
          </Card>

          <div className='space-y-6'>
            <Card className='border-0 p-6'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-slate-900'>Order Summary</h2>
                  <p className='text-sm text-slate-500'>Estimated arrival in {estimatedDelivery}</p>
                </div>
                <span className='rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700'>Fast delivery</span>
              </div>

              <div className='mt-6 space-y-4'>
                <div className='space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                  {cartItems.map((item) => (
                    <div key={item.id || item.name} className='flex items-center justify-between gap-4 text-sm text-slate-700'>
                      <div>
                        <p className='font-medium text-slate-900'>{item.name}</p>
                        <p className='text-xs text-slate-500'>Qty: {item.quantity}</p>
                      </div>
                      <p className='font-semibold text-slate-900'>₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className='rounded-3xl border border-slate-200 p-4'>
                  <h3 className='text-sm font-semibold text-slate-900'>Apply a coupon</h3>
                  <div className='mt-3 space-y-3'>
                    {availableCoupons.map((coupon) => (
                      <button
                        key={coupon.code}
                        type='button'
                        onClick={() => applyCoupon(coupon)}
                        className={`w-full rounded-3xl border p-4 text-left transition ${selectedCoupon?.code === coupon.code ? 'border-[#ff4d2d] bg-orange-50 shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                      >
                        <div className='flex items-center justify-between gap-3'>
                          <div>
                            <p className='font-medium text-slate-900'>{coupon.code}</p>
                            <p className='text-sm text-slate-500'>{coupon.label}</p>
                          </div>
                          <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700'>Apply</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className='mt-6 space-y-3 rounded-3xl border border-slate-200 bg-white p-5'>
                <div className='flex justify-between text-sm text-slate-700'>
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className='flex justify-between text-sm text-slate-700'>
                  <span>Delivery fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
                <div className='flex justify-between text-sm text-slate-700'>
                  <span>Estimated tax</span>
                  <span>₹{taxAmount}</span>
                </div>
                <div className='flex justify-between text-sm text-slate-700'>
                  <span>Coupon savings</span>
                  <span>-₹{couponDiscount}</span>
                </div>
                <hr className='my-3 border-slate-200' />
                <div className='flex justify-between text-lg font-semibold text-slate-900'>
                  <span>Total payable</span>
                  <span>₹{totalPayable}</span>
                </div>
              </div>

              <Button className='w-full' onClick={handlePlaceOrder}>
                {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut
