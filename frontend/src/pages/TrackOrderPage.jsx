import axios from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../config.js'
import { useEffect } from 'react'
import { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
import Card from '../components/ui/Card'
import { pageShell } from '../designTokens'
import { getRoleHome } from '../utils/navigation'

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState() 
    const navigate = useNavigate()
    const { socket, userData } = useSelector(state=>state.user)
    const [liveLocations,setLiveLocations]=useState({})
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
      if (!socket) return
      const handleUpdateDeliveryLocation = ({deliveryBoyId,latitude,longitude}) => {
        setLiveLocations(prev => ({
          ...prev,
          [deliveryBoyId]:{lat:latitude,lon:longitude}
        }))
      }
      socket.on('updateDeliveryLocation', handleUpdateDeliveryLocation)
      return () => {
        socket.off('updateDeliveryLocation', handleUpdateDeliveryLocation)
      }
    },[socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])
    return (
        <div className={`${pageShell} mx-auto flex max-w-4xl flex-col gap-6 p-4`}>
            <div className='relative left-[20px] top-[20px] z-[10] mb-[10px] flex items-center gap-4' onClick={() => navigate(getRoleHome(userData))}>
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                <h1 className='text-2xl font-semibold text-slate-900 md:text-center'>Track Order</h1>
            </div>
            {currentOrder?.shopOrders?.map((shopOrder, index) => (
                <Card className='space-y-4 border-0 p-4' key={index}>
                    <div>
                        <p className='mb-2 text-lg font-semibold text-[#ff4d2d]'>{shopOrder.shop.name}</p>
                        <p className='font-semibold text-slate-800'><span>Items:</span> {shopOrder.shopOrderItems?.map(i => i.name).join(",")}</p>
                        <p className='text-slate-600'><span className='font-semibold'>Subtotal:</span> {shopOrder.subtotal}</p>
                        <p className='mt-6 text-slate-600'><span className='font-semibold'>Delivery address:</span> {currentOrder.deliveryAddress?.text}</p>
                    </div>
                    {shopOrder.status !== "delivered" ? <>
                        {shopOrder.assignedDeliveryBoy ?
                            <div className='text-sm text-slate-700'>
                                <p className='font-semibold'><span>Delivery Boy Name:</span> {shopOrder.assignedDeliveryBoy.fullName}</p>
                                <p className='font-semibold'><span>Delivery Boy contact No.:</span> {shopOrder.assignedDeliveryBoy.mobile}</p>
                            </div> : <p className='font-semibold text-slate-700'>Delivery Boy is not assigned yet.</p>}
                    </> : <p className='text-lg font-semibold text-green-600'>Delivered</p>}

                    {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && (
                        <div className='h-[400px] w-full overflow-hidden rounded-2xl shadow-md'>
                            <DeliveryBoyTracking data={{
                                deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                },
                                customerLocation: {
                                    lat: currentOrder.deliveryAddress.latitude,
                                    lon: currentOrder.deliveryAddress.longitude
                                }
                            }} />
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}

export default TrackOrderPage
