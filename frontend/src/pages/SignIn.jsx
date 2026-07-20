import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../config.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { pageShell } from '../designTokens';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
    const gotoRolePage = (role) => {
      if (role === 'owner') return navigate('/admin')
      if (role === 'deliveryBoy') return navigate('/delivery')
      return navigate('/')
    }
     const handleSignIn=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
            },{withCredentials:true})
           dispatch(setUserData(result.data))
           gotoRolePage(result.data.role)
            setErr("")
            setLoading(false)
        } catch (error) {
           setErr(error?.response?.data?.message)
           setLoading(false)
        }
     }
     const handleGoogleAuth=async () => {
             setLoading(true)
             const provider=new GoogleAuthProvider()
             try {
               const result=await signInWithPopup(auth,provider)
               const fullName = result.user.displayName || result.user.email?.split('@')[0] || ''
               const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
                   fullName,
                   email: result.user.email,
                   role: 'user',
                   mobile: '0000000000'
               },{withCredentials:true})
               dispatch(setUserData(data))
               setErr("")
             } catch (error) {
               setErr(error?.response?.data?.message || error?.message || 'Google sign in failed')
             } finally {
               setLoading(false)
             }
          }
    return (
        <div className={`${pageShell} flex min-h-screen w-full items-center justify-center p-4`}>
            <Card className='w-full max-w-md border border-slate-200/80 p-8'>
                <h1 className='mb-2 text-3xl font-semibold tracking-tight text-[#ff4d2d]'>QuickBite</h1>
                <p className='mb-8 text-sm text-slate-600'> Sign In to your account to get started with delicious food deliveries
                </p>

                <div className='mb-4'>
                    <Input label='Email' type='email' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required />
                </div>

                <div className='mb-4'>
                    <label htmlFor="password" className='mb-1.5 block text-sm font-medium text-slate-700'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/15' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                        <button className='absolute right-3 top-[14px] text-gray-500' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>
                <div className='mb-4 text-right text-sm font-medium text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/forgot-password")}>
                  Forgot Password
                </div>

                <Button type='button' className='w-full' onClick={handleSignIn} disabled={loading}>
                    {loading?<ClipLoader size={20} color='white'/>:"Sign In"}
                </Button>
                {err && <p className='my-[10px] text-center text-sm text-red-500'>*{err}</p>}

                <button type='button' className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50' onClick={handleGoogleAuth}>
                    <FcGoogle size={20}/>
                    <span>Sign In with Google</span>
                </button>
                <p className='mt-6 cursor-pointer text-center text-sm text-slate-600' onClick={()=>navigate("/signup")}>Want to create a new account? <span className='font-semibold text-[#ff4d2d]'>Sign Up</span></p>
            </Card>
        </div>
    )
}

export default SignIn
