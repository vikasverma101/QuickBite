import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
import Card from './ui/Card';

function CartItemCard({data}) {
    const dispatch=useDispatch()
    const handleIncrease=(id,currentQty)=>{
       dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
      const handleDecrease=(id,currentQty)=>{
        if(currentQty>1){
  dispatch(updateQuantity({id,quantity:currentQty-1}))
        }
        
    }
  return (
    <Card className='flex items-center justify-between border-0 p-4'>
      <div className='flex items-center gap-4'>
        <img loading="lazy" src={data.image} alt={data.name} className='h-20 w-20 rounded-xl border border-slate-200 object-cover'/>
        <div>
            <h1 className='font-semibold text-slate-900'>{data.name}</h1>
            <p className='text-sm text-slate-500'>₹{data.price} x {data.quantity}</p>
            <p className='font-semibold text-slate-900'>₹{data.price*data.quantity}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <button className='rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200' onClick={()=>handleDecrease(data.id,data.quantity)}>
        <FaMinus size={12}/>
        </button>
        <span className='min-w-6 text-center text-sm font-semibold text-slate-700'>{data.quantity}</span>
        <button className='rounded-full bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200'  onClick={()=>handleIncrease(data.id,data.quantity)}>
        <FaPlus size={12}/>
        </button>
        <button className='rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200'
 onClick={()=>dispatch(removeCartItem(data.id))}>
<CiTrash size={18}/>
        </button>
      </div>
    </Card>
  )
}

export default CartItemCard
