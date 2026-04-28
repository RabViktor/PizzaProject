import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './CourierLogin.css'
import { useCart } from '../context/CartContext';

export function CourierLogin(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {showToast} = useCart();

    const send = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
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

            if(data.role === "courier"){
                const expiresAt = Date.now() + 30 * 60 * 1000;

                localStorage.setItem("courier", JSON.stringify({
                    role: data.role,
                    user: data.user,
                    token: data.token,
                    expiresAt
                }));

                showToast("Sikeres bejelentkezés!");
                navigate("/courier-panel/");
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
            <div className="courier-div">
                <form className="courier-form" onSubmit={send}>
                    <div className="courier-h2">
                        <h2>Futár bejelentkezés</h2>
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
                        <button type="submit" className="courier-lgn-btn">Belépés</button>
                    </div>
                </form>
            </div>
        </>
    )
}
