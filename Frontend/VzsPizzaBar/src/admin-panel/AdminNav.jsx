import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./AdminNav.css";

export function AdminNav() {

    const [open, setOpen] = useState(true);

    return (
        <nav className={`admin-nav ${open ? "open" : "closed"}`}>
            
            <div className="admin-top">
                <button className="admin-toggle" onClick={() => setOpen(!open)}>
                    {open ? "⮜" : "⮞"}
                </button>

                {open && (
                    <div className="admin-logo">
                        <h1>Admin Panel</h1>
                    </div>
                )}
            </div>

            {open && (
                <ul className="admin-menu">
                    <li><NavLink to="/admin-panel/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/admin-panel/users">Felhasználók</NavLink></li>
                    <li><NavLink to="/admin-panel/products">Termékek</NavLink></li>
                    <li><NavLink to="/admin-panel/orders">Rendelések</NavLink></li>
                </ul>
            )}

        </nav>
    );
}
