import jwt from "jsonwebtoken"
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Authentication token not found." })
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodeToken) {
            return res.status(401).json({ message: "Invalid authentication token." })
        }
        req.userId = decodeToken.userId
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Authentication failed. Please sign in again." })
        }
        return res.status(500).json({ message: "Authentication middleware error." })
    }
}

export default isAuth