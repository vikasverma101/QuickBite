import User from "../models/user.model.js"
import bcrypt, { hash } from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"
import dotenv from "dotenv"
dotenv.config()

const getCookieOptions = () => ({
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: '/'
})

const serializeUser = (user) => {
    if (!user) return null
    const output = user.toObject ? user.toObject() : { ...user }
    delete output.password
    return output
}

export const signUp=async (req,res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        if (!fullName || !email || !password || !mobile || !role) {
            return res.status(400).json({ message: "fullName, email, password, mobile and role are required." })
        }
        if (!['user', 'owner', 'deliveryBoy'].includes(role)) {
            return res.status(400).json({ message: "role must be user, owner, or deliveryBoy." })
        }
        const user=await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists." })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "mobile no must be at least 10 digits." })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hashedPassword
        })

        const token = await genToken(newUser._id)
        res.cookie("token", token, getCookieOptions())

        return res.status(201).json(serializeUser(newUser))

    } catch (error) {
        return res.status(500).json({ message: `sign up error ${error}` })
    }
}

export const signIn=async (req,res) => {
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist."})
        }
        
     const isMatch=await bcrypt.compare(password,user.password)
     if(!isMatch){
         return res.status(400).json({message:"incorrect Password"})
     }

        const token=await genToken(user._id)
        res.cookie("token",token,getCookieOptions())
  
        return res.status(200).json(serializeUser(user))

    } catch (error) {
        return res.status(500).json({message:`sign In error ${error}`})
    }
}

export const signOut=async (req,res) => {
    try {
        res.clearCookie("token", getCookieOptions())
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        return res.status(500).json({message:`sign out error ${error}`})
    }
}

export const sendOtp=async (req,res) => {
  try {
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
       return res.status(400).json({message:"User does not exist."})
    }
    const otp=Math.floor(1000 + Math.random() * 9000).toString()
    user.resetOtp=otp
    user.otpExpires=Date.now()+5*60*1000
    user.isOtpVerified=false
    await user.save()
    await sendOtpMail(email,otp)
    return res.status(200).json({message:"otp sent successfully"})
  } catch (error) {
     return res.status(500).json({message:`send otp error ${error}`})
  }  
}

export const verifyOtp=async (req,res) => {
    try {
        const {email,otp}=req.body
        const user=await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"invalid/expired otp"})
        }
        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined
        await user.save()
        return res.status(200).json({message:"otp verify successfully"})
    } catch (error) {
         return res.status(500).json({message:`verify otp error ${error}`})
    }
}  

export const resetPassword=async (req,res) => {
    try {
        const {email,newPassword}=req.body
        const user=await User.findOne({email})
    if(!user || !user.isOtpVerified){
       return res.status(400).json({message:"otp verification required"})
    }
    if(!newPassword || newPassword.length < 6){
       return res.status(400).json({message:"new password must be at least 6 characters."})
    }
    const hashedPassword=await bcrypt.hash(newPassword,10)
    user.password=hashedPassword
    user.isOtpVerified=false
    await user.save()
     return res.status(200).json({message:"password reset successfully"})
    } catch (error) {
         return res.status(500).json({message:`reset password error ${error}`})
    }
}

export const googleAuth=async (req,res) => {
    try {
        let { fullName, email, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            if (!mobile || !role) {
                return res.status(400).json({ message: "Google auth requires mobile and role for first-time signup." })
            }
            if (!['user', 'owner', 'deliveryBoy'].includes(role)) {
                return res.status(400).json({ message: "role must be user, owner, or deliveryBoy." })
            }
            if (!fullName && email) {
                fullName = email.split('@')[0]
            }
            user = await User.create({
                fullName,
                email,
                mobile,
                role
            })
        }

        const token = await genToken(user._id)
        res.cookie("token", token, getCookieOptions())

        return res.status(200).json(serializeUser(user))

    } catch (error) {
         return res.status(500).json({ message: `googleAuth error ${error}` })
    }
}