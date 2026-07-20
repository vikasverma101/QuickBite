import React, { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import { serverUrl } from './config.js'

// Lazy-loaded pages to reduce initial bundle
const Landing = lazy(() => import('./pages/Landing'))
const SignUp = lazy(() => import('./pages/SignUp'))
const SignIn = lazy(() => import('./pages/SignIn'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const CreateEditShop = lazy(() => import('./pages/CreateEditShop'))
const AddItem = lazy(() => import('./pages/AddItem'))
const EditItem = lazy(() => import('./pages/EditItem'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckOut = lazy(() => import('./pages/CheckOut'))
const OrderPlaced = lazy(() => import('./pages/OrderPlaced'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'))
const Shop = lazy(() => import('./pages/Shop'))
const FoodDetails = lazy(() => import('./pages/FoodDetails'))
const UserDashboard = lazy(() => import('./components/UserDashboard'))
const OwnerDashboard = lazy(() => import('./components/OwnerDashboard'))
const DeliveryBoy = lazy(() => import('./components/DeliveryBoy'))
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'
import Layout from './components/Layout'
import LoadingFallback from './components/LoadingFallback'
const getLandingRoute = (role) => {
  if (role === 'owner') return '/admin'
  if (role === 'deliveryBoy') return '/delivery'
  return '/'
}

function App() {
  const { userData, isAuthLoading } = useSelector(state => state.user)
  const dispatch = useDispatch()
  useGetCurrentUser()
  useUpdateLocation()
  useGetCity()
  useGetMyshop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  useEffect(() => {
    if (!userData) return
    const socketInstance = io(serverUrl, { withCredentials: true })
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect', () => {
      socketInstance.emit('identity', { userId: userData._id })
    })
    return () => {
      socketInstance.disconnect()
    }
  }, [userData, dispatch])

  if (isAuthLoading) {
    return <LoadingFallback />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path='/'
          element={!userData ? <Landing /> : userData?.role === 'user' ? <Layout /> : <Navigate to={getLandingRoute(userData?.role)} />}
        >
          {userData?.role === 'user' && <Route index element={<UserDashboard />} />}
        </Route>

        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={getLandingRoute(userData?.role)} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={getLandingRoute(userData?.role)} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={getLandingRoute(userData?.role)} />} />
        <Route path='/delivery' element={userData?.role === 'deliveryBoy' ? <DeliveryBoy /> : <Navigate to='/' />} />
        <Route path='*' element={!userData ? <Navigate to='/' /> : <Navigate to={getLandingRoute(userData?.role)} />} />

        <Route path='/*' element={userData ? <Layout /> : <Navigate to='/' />}>
          <Route path='create-edit-shop' element={<CreateEditShop />} />
          <Route path='add-item' element={<AddItem />} />
          <Route path='edit-item/:itemId' element={<EditItem />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckOut />} />
          <Route path='order-placed' element={<OrderPlaced />} />
          <Route path='my-orders' element={<MyOrders />} />
          <Route path='profile' element={<UserProfile />} />
          <Route path='track-order/:orderId' element={<TrackOrderPage />} />
          <Route path='shop/:shopId' element={<Shop />} />
          <Route path='item/:itemId' element={<FoodDetails />} />
          <Route path='admin' element={userData?.role === 'owner' ? <OwnerDashboard /> : <Navigate to='/' />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
