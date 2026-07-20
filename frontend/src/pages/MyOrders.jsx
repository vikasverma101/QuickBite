import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';
import Card from '../components/ui/Card';
import { pageShell } from '../designTokens';
import { getRoleHome } from '../utils/navigation';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket || !userData) return
    const handleNewOrder = (data) => {
      if (data.shopOrders?.owner?._id === userData._id) {
        dispatch(setMyOrders([data, ...myOrders]))
      }
    }
    const handleUpdateStatus = ({ orderId, shopId, status, userId }) => {
      if (userId === userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
      }
    }
    socket.on('newOrder', handleNewOrder)
    socket.on('update-status', handleUpdateStatus)

    return () => {
      socket.off('newOrder', handleNewOrder)
      socket.off('update-status', handleUpdateStatus)
    }
  }, [socket, userData, myOrders, dispatch])

  return (
    <div className={`${pageShell} min-h-screen px-3 py-4 sm:px-4 sm:py-6`}>
      <div className='mx-auto w-full max-w-[860px]'>
        <div className='mb-6 flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur'>
          <div className='z-[10] cursor-pointer rounded-full bg-[#ff4d2d]/10 p-2' onClick={() => navigate(getRoleHome(userData))}>
            <IoIosArrowRoundBack size={24} className='text-[#ff4d2d]' />
          </div>
          <div>
            <h1 className='text-xl font-semibold text-slate-900'>My Orders</h1>
            <p className='text-sm text-slate-500'>Track every order in one place.</p>
          </div>
        </div>
        <div className='space-y-4'>
          {myOrders?.length ? myOrders.map((order, index) => (
            userData.role === "user" ?
              <UserOrderCard data={order} key={index} />
              :
              userData.role === "owner" ? (
                <OwnerOrderCard data={order} key={index} />
              )
                : null
          )) : (
            <Card className='p-6 text-center text-slate-600'>No orders yet. Start exploring delicious meals and place your first order.</Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
