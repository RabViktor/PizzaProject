import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import productsRoute from "./routes/products.js"
import authRoute from "./routes/auth.js"
import profileRoutes from "./routes/profileRoutes.js"
import Stripe from "stripe"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const {items, email} = req.body

        const line_items = items.map(item => (
            {
                price_data: {
                    currency: "huf",
                    product_data: {name: item.name},
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        ))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email: email,
            success_url: "http://localhost:5000/success",
            cancel_url: "http://localhost:5000/cart"
        })

        res.json({url: session.url})

    } catch (err) {
        console.error(err)
        res.status(500).json({error: "stripe hiba"})
    }
})

app.use("/api/products", productsRoute)
app.use("/api/auth", authRoute)
app.use("/api/profile", profileRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Backend fut a ${PORT} porton`)
})
