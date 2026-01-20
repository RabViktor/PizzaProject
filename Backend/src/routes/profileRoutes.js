import express from "express"
import { supabase } from "../supabase.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

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
    const { name, phone, postcode, city, roadnum, email } = req.body;

    // 1) USERS tábla frissítése
    const { data: userData, error: userErr } = await supabase
        .from("users")
        .update({
            name,
            phone,
            postcode,
            city,
            roadnum,
            email
        })
        .eq("id", userId)
        .select()
        .single();

    if (userErr) {
        return res.status(500).json({ error: userErr.message });
    }

    // 2) AUTH email frissítése
    const { data: authData, error: authErr } = await supabase.auth.updateUser({
        email: email
    });

    if (authErr) {
        return res.status(400).json({ error: authErr.message });
    }

    return res.json({
        message: "Profil és email frissítve",
        user: userData
    });
});



export default router