import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { pageShell } from '../designTokens';
import { motion } from 'framer-motion';

function OrderPlaced() {
    const navigate=useNavigate()
  return (
    <div className={`${pageShell} relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center`}>
      <Card className='w-full max-w-md border-0 p-8'>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl text-emerald-700'
        >
          <FaCircleCheck />
        </motion.div>
        <h1 className='mb-2 text-3xl font-semibold text-slate-900'>Order Placed!</h1>
        <p className='mb-6 max-w-md text-slate-600'>Thank you for your purchase. Your order is being prepared. You can track your order status in the "My Orders" section.</p>
        <Button onClick={() => navigate("/my-orders")}>Back to my orders</Button>
      </Card>
    </div>
  )
}

export default OrderPlaced

