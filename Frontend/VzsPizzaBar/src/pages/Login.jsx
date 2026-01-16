import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export function Login() {
  const navi = useNavigate();
  const { showToast } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const send = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Töltsd ki az összes mezőt!");
      return;
    }

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
        showToast("Hibás jelszó vagy email cím!");
        return;
      }

      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("Sikeres bejelentkezés!");

      setTimeout(() => {
        navi("/");
      }, 1000);
    } catch (err) {
      showToast("Hálózati hiba történt!");
      console.error(err);
    }
  };

  return (
    <div className="login-div">
      <form className="login-form" onSubmit={send}>
        <div className="login-h2">
          <h2>Bejelentkezés</h2>
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

        <div className="forgot-pass">
          <NavLink style={{ textDecoration: "none" }}>
            <p>Elfelejtett jelszó</p>
          </NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <button type="submit" className="login-btn">Belépés</button>
          <NavLink to={"/registration"} style={{ textDecoration: "none" }}>
            <p className="login-to-reg">Nincs fiókod? Regisztrálj!</p>
          </NavLink>
        </div>
      </form>
    </div>
  );
}
