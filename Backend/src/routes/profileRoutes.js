import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

/* -----------------------------
   PROFIL LEKÉRÉSE
----------------------------- */
router.get("/me", async (req, res) => {
    const userId = req.query.user_id;

    if (!userId || userId === "null") {
        return res.status(400).json({ error: "Missing user_id" });
    }

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) return res.status(500).json({ error });

    res.json(data);
});

/* -----------------------------
   PROFIL FRISSÍTÉSE
----------------------------- */
router.put("/update", async (req, res) => {
    const userId = req.query.user_id;

    if (!userId || userId === "null") {
        return res.status(400).json({ error: "Missing user_id" });
    }

    const { name, phone, postcode, city, roadnum } = req.body;

    const { data, error } = await supabase
        .from("users")
        .update({ name, phone, postcode, city, roadnum })
        .eq("id", userId)
        .select()
        .single();

    if (error) return res.status(500).json({ error });

    res.json(data);
});

/* -----------------------------
   FELHASZNÁLÓ RENDELÉSEI
----------------------------- */
router.get("/orders", async (req, res) => {
    const userId = req.query.user_id;

    if (!userId || userId === "null") {
        return res.status(400).json({ error: "Missing user_id" });
    }

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error });

    res.json(data);
});

/* -----------------------------
   EGY RENDELÉS TÉTELEI
----------------------------- */
router.get("/order/:id", async (req, res) => {
    const orderId = req.params.id;

    const { data, error } = await supabase
        .from("order_items")
        .select("*, products(name, image)")
        .eq("order_id", orderId);

    if (error) return res.status(500).json({ error });

    res.json(data);
});

export default router;
