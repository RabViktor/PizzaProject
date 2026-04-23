import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

// -----------------------------
// 1) DASHBOARD STATISZTIKÁK
// -----------------------------
router.get("/stats", async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: todayOrders } = await supabase
            .from("orders")
            .select("*")
            .gte("created_at", todayStart);

        const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const { data: weeklyOrders } = await supabase
            .from("orders")
            .select("*")
            .gte("created_at", weekStart);

        const { data: activeOrders } = await supabase
            .from("orders")
            .select("*")
            .in("status", ["pending", "in_progress", "delivering"]);

        const { data: todayRevenueData } = await supabase
            .from("orders")
            .select("total_price")
            .gte("created_at", todayStart);

        const todayRevenue = todayRevenueData?.reduce(
            (sum, o) => sum + o.total_price,
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

export default router;
