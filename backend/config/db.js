import mongoose from "mongoose"

const connectDb=async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL
        if (!mongoUri) {
            console.error("Missing MONGODB_URI or MONGODB_URL environment variable.")
            process.exit(1)
        }
        await mongoose.connect(mongoUri)
        console.log("db connected")
    } catch (error) {
        console.error("db error", error)
        process.exit(1)
    }
}

export default connectDb