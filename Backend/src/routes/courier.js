import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

/* ---------------------------------------------------
   FUTÁR SAJÁT RENDELÉSEI
--------------------------------------------------- */
router.get("/orders/:courierId", async (req, res) => {
    const { courierId } = req.params;

    // 1) Rendelések lekérése
    const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("courier_id", courierId)
        .order("created_at", { ascending: false });

    if (ordersError) {
        console.error(ordersError);
        return res.status(500).json({ error: "Nem sikerült lekérni a rendeléseket" });
    }

    // Ha nincs rendelés, küldjük vissza üresen
    if (orders.length === 0) {
        return res.json([]);
    }

    // 2) User ID-k kigyűjtése
    const userIds = orders.map(o => o.user_id);

    // 3) Userek lekérése
    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name, phone")
        .in("id", userIds);

    if (usersError) {
        console.error(usersError);
        return res.status(500).json({ error: "Nem sikerült lekérni a felhasználókat" });
    }

    // 4) JOIN (összefűzés)
    const merged = orders.map(order => {
        const user = users.find(u => u.id === order.user_id);
        return {
            ...order,
            user_name: user?.name || "N/A",
            user_phone: user?.phone || "N/A"
        };
    });

    res.json(merged);
});


/* ---------------------------------------------------
   FUTÁR RENDELÉS STÁTUSZ FRISSÍTÉS
--------------------------------------------------- */
router.put("/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: "Nem sikerült frissíteni a státuszt" });
    }

    res.json({ message: "Státusz frissítve!" });
});

export default router;
