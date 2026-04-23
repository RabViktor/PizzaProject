import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// -----------------------------
// 1) DASHBOARD STATISZTIKÁK
// -----------------------------
router.get("/stats", async (req, res) => {
    try {
        // --- MAI NAP UTC szerint ---
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        // --- 7 NAPJA UTC szerint ---
        const weekAgo = new Date();
        weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
        weekAgo.setUTCHours(0, 0, 0, 0);
        const weekAgoISO = weekAgo.toISOString();

        // 1) Mai rendelések száma
        const { data: todayOrders } = await supabase
            .from("orders")
            .select("*")
            .gte("created_at", todayISO);

        // 2) Heti rendelések száma
        const { data: weeklyOrders } = await supabase
            .from("orders")
            .select("*")
            .gte("created_at", weekAgoISO);

        // 3) Aktív rendelések
        const { data: activeOrders } = await supabase
            .from("orders")
            .select("*")
            .in("status", ["pending", "in_progress", "delivering"]);

        // 4) Mai bevétel (completed rendeléseknél)
        const { data: todayRevenueData } = await supabase
            .from("orders")
            .select("total_price")
            .gte("created_at", todayISO);


        const todayRevenue = todayRevenueData?.reduce(
            (sum, o) => sum + (o.total_price || 0),
            0
        ) || 0;


        res.json({
            todayOrders: todayOrders?.length || 0,
            weeklyOrders: weeklyOrders?.length || 0,
            activeOrders: activeOrders?.length || 0,
            todayRevenue
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Hiba történt a statisztikák lekérésekor" });
    }
});


// --------------------------------------
// 2) RENDELÉS STÁTUSZ MEGOSZLÁS (PIE)
// --------------------------------------
router.get("/order-status-stats", async (req, res) => {
    try {
        const statuses = ["pending", "in_progress", "delivering", "completed", "cancelled"];
        const result = {};

        for (const status of statuses) {
            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("status", status);

            result[status] = data?.length || 0;
        }

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Hiba történt a státusz statisztikák lekérésekor" });
    }
});

// --------------------------------------
// 3) ÖSSZES RENDELÉS LEKÉRÉSE
// --------------------------------------
router.get("/orders", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: "Nem sikerült lekérni a rendeléseket" });
        }

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Szerver hiba rendelés lekéréskor" });
    }
});

// --------------------------------------
// 4) FELHASZNÁLÓK LISTÁZÁSA
// --------------------------------------
router.get("/users", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Hiba történt a felhasználók lekérésekor" });
    }
});


router.put("/users/role", async (req, res) => {
    const { id, role } = req.body;

    const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Szerep frissítve!" });
});

// --------------------------------------
// TERMÉKEK LISTÁZÁSA
// --------------------------------------
router.get("/products", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Hiba történt a termékek lekérésekor" });
    }
});

// --------------------------------------
// ÚJ TERMÉK HOZZÁADÁSA
// --------------------------------------
router.post("/products", async (req, res) => {
    const { name, category, price, image, description } = req.body;

    const { error } = await supabase
        .from("products")
        .insert([{ name, category, price, image, description }]);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Termék hozzáadva!" });
});

// --------------------------------------
// TERMÉK SZERKESZTÉSE
// --------------------------------------
router.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, category, price, image, description } = req.body;

    const { error } = await supabase
        .from("products")
        .update({ name, category, price, image, description })
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Termék frissítve!" });
});

// --------------------------------------
// TERMÉK TÖRLÉSE
// --------------------------------------
router.delete("/products/:id", async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Termék törölve!" });
});

// --------------------------------------
// IDEIGLENES LEVÉTEL / VISSZATÉTEL
// --------------------------------------
router.put("/products/:id/toggle", async (req, res) => {
    const { id } = req.params;
    const { available } = req.body;

    const { error } = await supabase
        .from("products")
        .update({ available })
        .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Elérhetőség módosítva!" });
});

/* -----------------------------
   RENDELÉS STÁTUSZ FRISSÍTÉSE
----------------------------- */
router.put("/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

    if (error) {
        return res.status(500).json({ error: "Nem sikerült frissíteni a státuszt" });
    }

    res.json({ message: "Státusz frissítve!" });
});

/* -----------------------------
   FUTÁR HOZZÁRENDELÉSE
----------------------------- */
router.put("/orders/:id/courier", async (req, res) => {
    const { id } = req.params;
    const { courier_id } = req.body;

    const { error } = await supabase
        .from("orders")
        .update({ 
            courier_id,
            status: "delivering" 
        })
        .eq("id", id);

    if (error) {
        return res.status(500).json({ error: "Nem sikerült futárt hozzárendelni" });
    }

    res.json({ message: "Futár hozzárendelve!" });
});


export default router;
