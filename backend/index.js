import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"

const app=express()
const server=http.createServer(app)

const clientOriginConfig = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173"
const allowedOrigins = clientOriginConfig.split(",").map((origin) => origin.trim()).filter(Boolean)

const io=new Server(server,{
   cors:{
    origin: allowedOrigins,
    credentials:true,
    methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS']
}
})

app.set("io",io)

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS policy: origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

socketHandler(io)

const port = Number(process.env.PORT) || 5000

const handleServerError = (error) => {
    if (error.syscall !== 'listen') {
        console.error('Server failed to start', error)
        process.exit(1)
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
    if (error.code === 'EADDRINUSE') {
        console.error(`${bind} is already in use. Stop the service using this port or set PORT to a free port in backend/.env.`)
        process.exit(1)
    }

    console.error('Server failed to start', error)
    process.exit(1)
}

const startServer = async () => {
    await connectDb()
    server.on('error', handleServerError)
    server.listen(port, () => {
        console.log(`server started at ${port}`)
    })
}

startServer().catch((error) => {
    console.error('Server failed to start', error)
    process.exit(1)
})

