import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

/* ---------------------------------------------------
   FUTÁR SAJÁT RENDELÉSEI
--------------------------------------------------- */
router.get("/orders/:courierId", async (req, res) => {
    const { courierId } = req.params;

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("courier_id", courierId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return res.status(500).json({ error: "Nem sikerült lekérni a futár rendeléseit" });
    }

    res.json(data);
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
