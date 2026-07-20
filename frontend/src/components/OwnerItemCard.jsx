import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config.js';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import Card from './ui/Card';
import Badge from './ui/Badge';

function OwnerItemCard({data}) {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleDelete=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <Card className='flex w-full max-w-2xl overflow-hidden border-0 p-0'>
      <div className='w-36 flex-shrink-0 bg-slate-50'>
        <img loading="lazy" src={data.image} alt={data.name} className='h-full w-full object-cover' />
      </div>
      <div className='flex flex-1 flex-col justify-between p-4'>
        <div className='space-y-1'>
          <div className='flex items-start justify-between gap-3'>
            <h2 className='text-base font-semibold text-slate-900'>{data.name}</h2>
            <Badge tone='brand'>₹{data.price}</Badge>
          </div>
          <p className='text-sm text-slate-600'>Category: {data.category}</p>
          <p className='text-sm text-slate-600'>Food Type: {data.foodType}</p>
        </div>
        <div className='mt-3 flex items-center justify-between'>
          <div className='text-sm font-semibold text-[#ff4d2d]'>₹{data.price}</div>
          <div className='flex items-center gap-2'>
            <button className='rounded-full p-2 text-[#ff4d2d] transition hover:bg-[#ff4d2d]/10' onClick={()=>navigate(`/edit-item/${data._id}`)}>
              <FaPen size={16}/>
            </button>
            <button className='rounded-full p-2 text-[#ff4d2d] transition hover:bg-[#ff4d2d]/10' onClick={handleDelete}>
              <FaTrashAlt size={16}/>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OwnerItemCard
