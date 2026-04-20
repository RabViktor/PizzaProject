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

    // 1) Supabase Auth login
    const { data, error } = await supabasePublic.auth.signInWithPassword({
        email,
        password 
    }); 

    if (error) {
        return res.status(400).json({ error: error.message }); 
    } 

    // 2) Lekérjük a role-t a saját users táblából
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

    if (profileError) {
        return res.status(500).json({ error: "Nem sikerült lekérni a jogosultságot" });
    }

    // 3) Visszaküldjük a role-t is
    res.json({ 
        message: "Sikeres bejelentkezés!", 
        session: data.session, 
        user: data.user,
        role: profile.role
    }); 
});


router.post("/logout", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ error: "Nincs token" });
    }

    await supabase.auth.signOut();

    return res.json({ message: "Kijelentkezve" });
});



export default router;