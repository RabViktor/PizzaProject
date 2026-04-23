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


export default router;
