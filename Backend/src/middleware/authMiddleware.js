import { supabase } from "../supabase";

export async function authMiddleware(req, res, next){
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({error: "Nincs token"})
    }

    const { data, error } = await supabase.auth.getUser(token)

    if(error){
        return res.status(401).json({error: "Érvénytelen token"})
    }

    req.user = data.user
    next()
}