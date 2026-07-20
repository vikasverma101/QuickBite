import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config.js';
import { ClipLoader } from 'react-spinners';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { pageShell } from '../designTokens';

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [err, setErr] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
      console.log(result)
      setErr("")
      setStep(2)
      setLoading(false)
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }
  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
      console.log(result)
      setErr("")
      setStep(3)
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  const handleResetPassword = async () => {
    if (newPassword != confirmPassword) {
      return null
    }
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
      setErr("")
      console.log(result)
      setLoading(false)
      navigate("/signin")
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  }
  return (
    <div className={`${pageShell} flex w-full items-center justify-center min-h-screen p-4`}>
      <Card className='w-full max-w-md p-8'>
        <div className='mb-4 flex items-center gap-4'>
          <IoIosArrowRoundBack size={30} className='cursor-pointer text-[#ff4d2d]' onClick={() => navigate("/signin")} />
          <h1 className='text-2xl font-semibold tracking-tight text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {step == 1
          &&
          <div>
            <div className='mb-6'>
              <Input label='Email' type='email' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <Button className='w-full' onClick={handleSendOtp} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Send Otp"}
            </Button>
            {err && <p className='my-[10px] text-center text-sm text-red-500'>*{err}</p>}
          </div>}

        {step == 2
          &&
          <div>
            <div className='mb-6'>
              <Input label='OTP' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} required />
            </div>
            <Button className='w-full' onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Verify"}
            </Button>
            {err && <p className='my-[10px] text-center text-sm text-red-500'>*{err}</p>}
          </div>}
        {step == 3
          &&
          <div>
            <div className='mb-6'>
              <Input label='New Password' type='password' placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
            </div>
            <div className='mb-6'>
              <Input label='Confirm Password' type='password' placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
            </div>
            <Button className='w-full' onClick={handleResetPassword} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Reset Password"}
            </Button>
            {err && <p className='my-[10px] text-center text-sm text-red-500'>*{err}</p>}
          </div>}
      </Card>
    </div>
  )
}

export default ForgotPassword
