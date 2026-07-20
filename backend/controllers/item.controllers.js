import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" })
        }
        const item = await Item.create({
            name, category, foodType, price, image, shop: shop._id
        })

        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        const io = req.app.get('io')
        if (io) {
          io.emit('city-data-updated', { city: shop.city })
        }
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `add item error ${error}` })
    }
}

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, foodType, price } = req.body
        const updateData = { name, category, foodType, price }
        if (req.file) {
            updateData.image = await uploadOnCloudinary(req.file.path)
        }

        const item = await Item.findById(itemId).populate('shop')
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        if (!item.shop || String(item.shop.owner) !== String(req.userId)) {
            return res.status(403).json({ message: "Not authorized to edit this item." })
        }

        const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, { new: true })
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        const io = req.app.get('io')
        if (io && shop?.city) {
          io.emit('city-data-updated', { city: shop.city })
        }
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `edit item error ${error}` })
    }
}

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `get item error ${error}` })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId).populate('shop')
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        if (!item.shop || String(item.shop.owner) !== String(req.userId)) {
            return res.status(403).json({ message: "Not authorized to delete this item." })
        }

        await Item.findByIdAndDelete(itemId)
        const shop = await Shop.findOne({ owner: req.userId })
        if (shop) {
            shop.items = shop.items.filter(i => String(i) !== String(item._id))
            await shop.save()
            await shop.populate({
                path: "items",
                options: { sort: { updatedAt: -1 } }
            })
            const io = req.app.get('io')
            if (io && shop.city) {
              io.emit('city-data-updated', { city: shop.city })
            }
        }
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `delete item error ${error}` })
    }
}

export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(200).json([])
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops || shops.length === 0) {
            return res.status(200).json([])
        }
        const shopIds = shops.map((shop) => shop._id)
        const items = await Item.find({ shop: { $in: shopIds } })
        return res.status(200).json(items)

    } catch (error) {
 return res.status(500).json({ message: `get item by city error ${error}` })
    }
}

export const getItemsByShop=async (req,res) => {
    try {
        const {shopId}=req.params
        const shop=await Shop.findById(shopId).populate("items")
        if(!shop){
            return res.status(400).json("shop not found")
        }
        return res.status(200).json({
            shop,items:shop.items
        })
    } catch (error) {
         return res.status(500).json({ message: `get item by shop error ${error}` })
    }
}

export const searchItems=async (req,res) => {
    try {
        const {query,city}=req.query
        if(!query){
            return res.status(200).json([])
        }
        const conditions = [
            { name: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } }
        ]
        if (city) {
            const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, "i") } })
            const shopIds = shops.map(s => s._id)
            if (shopIds.length === 0) {
                return res.status(200).json([])
            }
            const items = await Item.find({
                shop: { $in: shopIds },
                $or: conditions
            }).populate("shop","name image")
            return res.status(200).json(items)
        }
        const items = await Item.find({
            $or: conditions
        }).populate("shop","name image")
        return res.status(200).json(items)

    } catch (error) {
         return res.status(500).json({ message: `search item  error ${error}` })
    }
}


export const rating=async (req,res) => {
    try {
        const {itemId,rating}=req.body

        if(!itemId || !rating){
            return res.status(400).json({message:"itemId and rating is required"})
        }

        if(rating<1 || rating>5){
             return res.status(400).json({message:"rating must be between 1 to 5"})
        }

        const item=await Item.findById(itemId)
        if(!item){
              return res.status(400).json({message:"item not found"})
        }

        const newCount=item.rating.count + 1
        const newAverage=(item.rating.average*item.rating.count + rating)/newCount

        item.rating.count=newCount
        item.rating.average=newAverage
        await item.save()
return res.status(200).json({rating:item.rating})

    } catch (error) {
         return res.status(500).json({ message: `rating error ${error}` })
    }
}