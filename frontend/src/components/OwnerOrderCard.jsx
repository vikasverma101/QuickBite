import axios from 'axios';
import React from 'react'
import { MdPhone } from "react-icons/md";
import { serverUrl } from '../config.js';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
            dispatch(updateOrderStatus({ orderId, shopId, status }))
            setAvailableBoys(result.data.availableBoys)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card className='space-y-4 border-0 p-4'>
            <div className='flex items-start justify-between gap-3'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>{data.user.fullName}</h2>
                    <p className='text-sm text-slate-500'>{data.user.email}</p>
                    <p className='mt-1 flex items-center gap-2 text-sm text-slate-600'><MdPhone /><span>{data.user.mobile}</span></p>
                    {data.paymentMethod === "online" ? <p className='mt-1 text-sm text-slate-600'>payment: {data.payment ? "true" : "false"}</p> : <p className='mt-1 text-sm text-slate-600'>Payment Method: {data.paymentMethod}</p>}
                </div>
                <Badge tone='brand'>#{data._id.slice(-6)}</Badge>
            </div>

            <div className='flex flex-col items-start gap-2 text-sm text-slate-600'>
                <p>{data?.deliveryAddress?.text}</p>
                <p className='text-xs text-slate-500'>Lat: {data?.deliveryAddress.latitude}, Lon {data?.deliveryAddress.longitude}</p>
            </div>

            <div className='flex space-x-4 overflow-x-auto pb-2'>
                {data.shopOrders?.shopOrderItems?.map((item, index) => (
                    <div key={index} className='w-40 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2'>
                            <img loading="lazy" src={item.item?.image} alt={item.name || item.item?.name || 'item image'} className='h-24 w-full rounded-lg object-cover' />
                        <p className='mt-1 text-sm font-semibold text-slate-800'>{item.name}</p>
                        <p className='text-xs text-slate-500'>Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                ))}
            </div>

            <div className='mt-auto flex items-center justify-between border-t border-slate-200 pt-3'>
                <span className='text-sm text-slate-700'>Status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data.shopOrders.status}</span></span>

                <select className='rounded-full border border-[#ff4d2d] px-3 py-1 text-sm text-[#ff4d2d] focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/20' onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Change</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out of delivery">Out Of Delivery</option>
                </select>
            </div>

            {data.shopOrders.status === "out of delivery" &&
                <div className='rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-slate-700'>
                    {data.shopOrders.assignedDeliveryBoy ? <p className='font-semibold text-slate-800'>Assigned Delivery Boy:</p> : <p className='font-semibold text-slate-800'>Available Delivery Boys:</p>}
                    {availableBoys?.length > 0 ? (
                        availableBoys.map((b, index) => (
                            <div className='mt-2 text-slate-700' key={index}>{b.fullName} - {b.mobile}</div>
                        ))
                    ) : data.shopOrders.assignedDeliveryBoy ? <div className='mt-2'>{data.shopOrders.assignedDeliveryBoy.fullName} - {data.shopOrders.assignedDeliveryBoy.mobile}</div> : <div className='mt-2'>Waiting for delivery boy to accept</div>}
                </div>}

            <div className='text-right text-sm font-semibold text-slate-900'>
                Total: ₹{data.shopOrders.subtotal}
            </div>
        </Card>
    )
}

export default OwnerOrderCard
