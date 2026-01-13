import express from "express"
import { supabase } from "../supabase.js"
import { supabasePublic } from "../supabasePublic.js"; 

const router = express.Router()

router.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    // 1. Auth user létrehozása
    const { data: user, error } = await supabase.auth.admin.createUser({
        email,
        password,
        phone,
        email_confirm: true,
        user_metadata: { name, phone }
    });

    if (error) return res.status(400).json({ error: error.message });

    // 2. Saját adatbázisba mentés (role = "user")
    const { error: insertError } = await supabase
        .from("users")
        .insert({
            id: user.user.id,   // ugyanaz az ID, mint az Auth useré
            name,
            email,
            phone,
            role: "user"
        });

    if (insertError) {
        return res.status(500).json({ error: insertError.message });
    }

    res.json({ message: "Sikeres regisztráció!", user });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body; 
    const { data, error } = await supabasePublic.auth.signInWithPassword({
        email,
        password 
    }); 
    if (error) {
        return res.status(400).json({ error: error.message }); 
    } 
     
    res.json({ 
        message: "Sikeres bejelentkezés!", 
        session: data.session, 
        user: data.user 
    }); 
});


export default router;