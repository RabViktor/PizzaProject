import express from "express";
import Stripe from "stripe";
import { supabase } from "../supabase.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { items, customerData } = req.body;

        const productIds = items.map(i => i.id);

        const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: "DB error" });
        }

        const line_items = items.map(cartItem => {
            const product = products.find(p => p.id === cartItem.id);

            return {
                price_data: {
                    currency: "huf",
                    product_data: { name: product.name },
                    unit_amount: product.price * 100
                },
                quantity: cartItem.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email: customerData.email,
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cart",
            metadata: {
                user_id: customerData.user_id,
                items: JSON.stringify(items),
                name: customerData.name,
                phone: customerData.phone,
                city: customerData.city,
                roadNum: customerData.roadNum,
                comment: customerData.comment,
                payment: customerData.payment
            }
        });

        res.json({ url: session.url });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Stripe error" });
    }
});

export default router;
