import express from "express"
import { supabase } from "../supabase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/me", authMiddleware, async (req, res) => {
    const userId = req.user.id

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

    if(error){
        return res.status(500).json({error: error.message})
    }

    res.json(data)
})

router.put("/update", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { name, phone, postcode, city, roadnum } = req.body;

    const { data, error } = await supabase
        .from("users")
        .update({
            name,
            phone,
            postcode,
            city,
            roadnum
        })
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});


export default router