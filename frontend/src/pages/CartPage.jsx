import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { pageShell } from '../designTokens';
import { getRoleHome } from '../utils/navigation';

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    return (
        <div className={`${pageShell} flex min-h-screen justify-center p-6`}>
            <div className='w-full max-w-[800px]'>
                <div className='mb-6 flex items-center gap-[20px]'>
                    <div className='z-[10] cursor-pointer' onClick={() => navigate(getRoleHome(userData))}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='text-2xl font-semibold text-slate-900'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <Card className='p-8 text-center text-lg text-slate-600'>Your Cart is Empty</Card>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    <Card className='mt-6 flex items-center justify-between border-0 p-4'>
                        <h1 className='text-lg font-semibold text-slate-900'>Total Amount</h1>
                        <span className='text-xl font-bold text-[#ff4d2d]'>₹{totalAmount}</span>
                    </Card>
                    <div className='mt-4 flex justify-end' > 
                        <Button onClick={()=>navigate("/checkout")}>Proceed to CheckOut</Button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default CartPage
