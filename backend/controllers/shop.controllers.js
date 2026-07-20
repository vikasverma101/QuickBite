import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop=async (req,res) => {
    try {
       const user = await User.findById(req.userId)
       if (!user || user.role !== 'owner') {
         return res.status(403).json({ message: "Only restaurant owners can create or edit a shop." })
       }
       const {name,city,state,address}=req.body
       if (!name || !city || !state || !address) {
         return res.status(400).json({ message: "name, city, state and address are required." })
       }
       let image;
       if(req.file){
        image=await uploadOnCloudinary(req.file.path)
       }
       let shop=await Shop.findOne({owner:req.userId})
       if(!shop){
         if (!image) {
           return res.status(400).json({ message: "Shop image is required." })
         }
         shop=await Shop.create({
           name,city,state,address,image,owner:req.userId
         })
       } else {
         const updateData = { name, city, state, address }
         if (image) updateData.image = image
         shop=await Shop.findByIdAndUpdate(shop._id, updateData, { new:true })
       }
       await shop.populate("owner items")
       const io = req.app.get('io')
       if (io) {
         io.emit('city-data-updated', { city: shop.city })
       }
       return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({message:`create shop error ${error}`})
    }
}

export const getMyShop=async (req,res) => {
    try {
        const shop=await Shop.findOne({owner:req.userId}).populate("owner").populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        if(!shop){
            return res.status(200).json(null)
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message:`get my shop error ${error}`})
    }
}

export const getShopByCity=async (req,res) => {
    try {
        const {city}=req.params

        const shops=await Shop.find({
            city:{$regex:new RegExp(`^${city}$`, "i")}
        }).populate('items')
        if(!shops){
            return res.status(400).json({message:"shops not found"})
        }
        return res.status(200).json(shops)
    } catch (error) {
        return res.status(500).json({message:`get shop by city error ${error}`})
    }
}