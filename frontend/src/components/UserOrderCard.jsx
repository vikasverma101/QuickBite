import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config.js'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/userSlice'
import { useToast } from '../components/ToastProvider.jsx'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useToast()
    const [selectedRating, setSelectedRating] = useState({})//itemId:rating

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })

    }

    const handleRating = async (itemId, rating) => {
        try {
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true })
            setSelectedRating(prev => ({
                ...prev, [itemId]: rating
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const statusSteps = [
        { key: 'placed', label: 'Placed' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'preparing', label: 'Preparing' },
        { key: 'out of delivery', label: 'Out for delivery' },
        { key: 'delivered', label: 'Delivered' },
    ]

    const normalizeStatus = (status) => {
        if (!status) return 'placed'
        if (status === 'out-for-delivery' || status === 'out of delivery') return 'out of delivery'
        return status
    }

    const getOverallStatus = () => {
        const rawStatus = data.shopOrders?.[0]?.status || 'placed'
        return normalizeStatus(rawStatus)
    }

    const formattedStatus = getOverallStatus()

    const estimateDelivery = () => {
        if (formattedStatus === 'delivered') return 'Arrived'
        if (formattedStatus === 'out of delivery') return '~10-20 min'
        if (formattedStatus === 'preparing') return '~20-35 min'
        if (formattedStatus === 'confirmed') return '~25-40 min'
        return '~30-50 min'
    }

    const downloadInvoice = () => {
        const contentLines = []
        contentLines.push(`Order #: ${data._id}`)
        contentLines.push(`Date: ${new Date(data.createdAt).toLocaleString()}`)
        contentLines.push('')
        data.shopOrders?.forEach((so) => {
            contentLines.push(`Shop: ${so.shop.name}`)
            so.shopOrderItems.forEach((it) => {
                contentLines.push(` - ${it.name} x${it.quantity} @ ₹${it.price}`)
            })
            contentLines.push(` Subtotal: ₹${so.subtotal}`)
            contentLines.push('')
        })
        contentLines.push(`Total: ₹${data.totalAmount}`)
        const blob = new Blob([contentLines.join('\n')], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${data._id}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleReorder = () => {
        // Add each item back to cart
        let count = 0
        data.shopOrders?.forEach((so) => {
            so.shopOrderItems.forEach((it) => {
                const cartItem = {
                    id: it.item._id || it.item.id || it._id,
                    name: it.name,
                    price: it.price,
                    quantity: it.quantity,
                    image: it.item?.image,
                }
                dispatch(addToCart(cartItem))
                count++
            })
        })
        toast.pushToast(`${count} items added to cart`, 'success')
        navigate('/cart')
    }


    return (
        <Card className='space-y-4 border-0 p-3 sm:p-4'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div>
                    <p className='font-semibold text-slate-900'>Order #{data._id.slice(-8)}</p>
                    <p className='text-sm text-slate-500'>Date: {formatDate(data.createdAt)}</p>
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                    <Badge tone={formattedStatus === 'delivered' ? 'success' : formattedStatus === 'preparing' || formattedStatus === 'confirmed' ? 'warning' : 'brand'} className='uppercase'>{formattedStatus}</Badge>
                    <p className='text-sm text-slate-500'>Est: {estimateDelivery()}</p>
                </div>
            </div>

            <div className='grid gap-4 lg:grid-cols-[1fr_280px]'>
                <div className='space-y-3'>
                    {data.shopOrders.map((shopOrder, index) => (
                        <div key={index} className='rounded-2xl border border-slate-200 bg-white p-4'>
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='font-semibold text-slate-800'>{shopOrder.shop.name}</p>
                                    <p className='text-xs text-slate-500'>Items: {shopOrder.shopOrderItems.length}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm font-semibold text-slate-900'>₹{shopOrder.subtotal}</p>
                                    <p className='text-xs text-slate-500'>{shopOrder.status}</p>
                                </div>
                            </div>

                            <div className='mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                                {shopOrder.shopOrderItems.map((item, idx) => (
                                    <div key={idx} className='flex items-center gap-3 rounded-xl border border-slate-100 p-2'>
                                        <img loading="lazy" src={item.item?.image} alt='' className='h-16 w-16 rounded object-cover' />
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-slate-900'>{item.name}</p>
                                            <p className='text-xs text-slate-500'>Qty {item.quantity} • ₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4'>
                                <div className='flex items-center gap-2'>
                                    {statusSteps.map((s) => {
                                        const stepActive = statusSteps.findIndex(st => st.key === s.key) <= statusSteps.findIndex(st => st.key === formattedStatus) || s.key === formattedStatus
                                        return (
                                            <div key={s.key} className='flex items-center gap-2'>
                                                <div className={`h-3 w-3 rounded-full ${stepActive ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                                                <p className='text-xs text-slate-500'>{s.label}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                    <p className='text-sm text-slate-500'>Order Summary</p>
                    <div className='mt-3 space-y-2'>
                        <div className='flex justify-between text-sm text-slate-700'>
                            <span>Subtotal</span>
                            <span>₹{data.subtotal || data.totalAmount}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-700'>
                            <span>Delivery</span>
                            <span>₹{data.deliveryFee ?? 0}</span>
                        </div>
                        <div className='flex justify-between text-sm text-slate-700'>
                            <span>Tax</span>
                            <span>₹{Math.round((data.totalAmount || 0) * 0.05)}</span>
                        </div>
                        <hr className='my-2 border-slate-200' />
                        <div className='flex justify-between text-lg font-semibold text-slate-900'>
                            <span>Total</span>
                            <span>₹{data.totalAmount}</span>
                        </div>
                    </div>

                    <div className='mt-4 grid gap-2'>
                        <Button onClick={() => navigate(`/track-order/${data._id}`)} className='w-full'>Track Order</Button>
                        <Button onClick={downloadInvoice} variant='secondary' className='w-full'>Download Invoice</Button>
                        <Button onClick={handleReorder} className='w-full bg-emerald-600'>Reorder</Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default UserOrderCard
