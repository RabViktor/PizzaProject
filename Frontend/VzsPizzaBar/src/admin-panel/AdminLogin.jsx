import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './AdminLogin.css'
import { useCart } from '../context/CartContext';

export function AdminLogin(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {showToast} = useCart();

    const send = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Hibás bejelentkezés");
                return;
            }
            if(data.role === "admin"){
                const expiresAt = Date.now() + 30 * 60 * 1000;
                localStorage.setItem("admin", JSON.stringify({
                   role: data.role,
                   user: data.user,
                   expiresAt
                }));
                console.log(data.user)
                showToast("Sikeres bejelentkezés!");
                navigate("/admin-panel/dashboard");
            }else{
                showToast("Nincs jogosultságod!");
                return;
            }

        } catch (err) {
            console.error(err);
            setError("Szerver hiba");
        }
    };

    return(
        <>
            <div className="admin-div">
                <form className="admin-form" onSubmit={send}>
                    <div className="admin-h2">
                        <h2>Admin bejelentkezés</h2>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "0 50px" }}>
                        <div>
                            <label htmlFor="email">E-mail cím:</label><br />
                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Jelszó:</label><br />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <button type="submit" className="admin-lgn-btn">Belépés</button>
                    </div>
                </form>
            </div>
        </>
    )
}
