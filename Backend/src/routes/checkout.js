import express from "express";
import Stripe from "stripe";
import { supabase } from "../supabase.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
    try {
        const { items, customerData } = req.body;

        // 1) Termékek lekérése
        const productIds = items.map(i => i.id);

        const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: "DB error" });
        }

        // 2) Teljes ár kiszámolása
        let total = 0;

        items.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            total += product.price * cartItem.quantity;
        });

        const deliveryFee = 990;
        total += deliveryFee;

        // 3) Rendelés mentése (order_number automatikusan generálódik!)
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: customerData.user_id || null,
                total,
                address: `${customerData.city}, ${customerData.roadNum}`,
                phone: customerData.phone,
                payment_method: customerData.payment,
                status: "pending"
            })
            .select()
            .single();

        if (orderError) {
            console.error(orderError);
            return res.status(500).json({ error: "Order insert error" });
        }

        // 4) order_items beszúrása
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_snapshot: item.price,
            sauce: item.sauces ? item.sauces.join(", ") : null,
            size: item.size || null
        }));

        const { error: orderItemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (orderItemsError) {
            console.error(orderItemsError);
            return res.status(500).json({ error: "Order items insert error" });
        }

        // 5) Stripe line_items összeállítása
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

        line_items.push({
            price_data: {
                currency: "huf",
                product_data: { name: "Kiszállítás" },
                unit_amount: deliveryFee * 100
            },
            quantity: 1
        });

        // 6) Stripe session létrehozása
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            customer_email: customerData.email,
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cart",
            metadata: {
                order_id: order.id,
                order_number: order.order_number,   // 🔥 már az adatbázis generálja!
                name: customerData.name,
                phone: customerData.phone,
                city: customerData.city,
                roadNum: customerData.roadNum,
                comment: customerData.comment,
                payment: customerData.payment
            }
        });

        // 7) Visszaküldjük a rendelés számot a frontendnek (készpénzes fizetéshez)
        res.json({ url: session.url, orderNumber: order.order_number });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Stripe error" });
    }
});

// Stripe session lekérő endpoint
router.get("/stripe-session/:id", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.json({
            orderNumber: session.metadata.order_number,
            method: session.metadata.payment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Session fetch error" });
    }
});

export default router;
