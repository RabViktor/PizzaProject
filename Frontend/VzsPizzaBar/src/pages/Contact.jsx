import { useState } from "react";
import "./Contact.css";
import { useCart } from "../context/CartContext";

export function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });

    const {showToast} = useCart();

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.message) {
            setError("Minden mező kitöltése kötelező!");
            return;
        }

        setError("");
        showToast("Üzenet elküldve!");
        setForm({
            name: "",
            email: "",
            message: ""
        });

    };

    return (
        <>
            <section className="contact-info">
                <div className="contact-cards">
                    <div className="contact-card">
                        <img className="kep" src="/location.png" alt="" />
                        <p className="con">Helyszín</p>
                        <p className="desc">5000 Szolnok, Áchim András utca 12-14</p>
                    </div>
                    <div className="contact-card">
                        <img className="kepp" src="/mail.png" alt="" />
                        <p className="con">E-mail</p>
                        <p className="desc">admin@vzspizzabar.hu</p>
                    </div>
                    <div className="contact-card">
                        <img className="kepo" src="/phone.png" alt="" />
                        <p className="con">Telefon</p>
                        <p className="desc">+36 70 123 4567</p>
                    </div>
                </div>
            </section>

            <div className="contact-div">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="login-h2">
                        <h2>Írj nekünk</h2>
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "0 50px" }}>
                        <div>
                            <label htmlFor="name">Teljes név:</label><br />
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email">E-mail cím:</label><br />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message">Üzenet:</label><br /> <br /> <br /> <br />
                            <textarea
                                className="mess"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <button type="submit" className="con-btn">Küldés</button>
                    </div>
                </form>
            </div>
        </>
    );
}
