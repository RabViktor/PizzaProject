import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import productsRoute from "./routes/products.js"
import authRoute from "./routes/auth.js"
import profileRoutes from "./routes/profileRoutes.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/products", productsRoute)
app.use("/api/auth", authRoute)
app.use("/api/profile", profileRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Backend fut a ${PORT} porton`)
})
