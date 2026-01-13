import express from "express";
import { supabase } from "../supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const category = req.query.category;

    let query = supabase.from("products").select("*");

    if (category) {
        query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error });

    res.json(data);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});


export default router;
