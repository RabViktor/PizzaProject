import "./Footer.css"
import { NavLink } from "react-router-dom";

export function Footer(){
    return (
        <>
            <div className="footer-line"></div>
            <footer>
                <div className="logo-div">
                    <img className="logo-footer" src="./logo.png" alt="vzsLogo" />
                </div>

                <div className="informations">
                    <h2>Kapcsolat, Információk:</h2>

                    <span className="beige">
                        <h3>Cím:</h3>
                    </span>
                    <p>5000 Szolnok, Áchim András utca 12-14</p>

                    <span className="beige">
                        <h3>Telefonszám:</h3>
                    </span>
                    <p>+36 12 34 56 789</p>

                    <span className="beige">
                        <h3>E-mail:</h3>
                    </span>
                    <p>noreply@vzspizzabar.hu</p>

                </div>

                <div className="opening">
                    <h2>Nyitvatartás:</h2>
                    <ul>
                        <li>Hétfő: 10:00 - 22:00</li>
                        <li>Kedd: 10:00 - 22:00</li>
                        <li>Szerda: 10:00 - 22:00</li>
                        <li>Csütörtök: 10:00 - 22:00</li>
                        <li>Péntek: 10:00 - 22:30</li>
                        <li>Szombat: 10:00 - 22:30</li>
                        <li>Vasárnap: 11:00 - 22:00</li>
                    </ul>
                </div>

                <div className="logos">
                    <NavLink> <img className="social-logo" src="./fb.png" alt="facebook logo" /> </NavLink>
                    <NavLink> <img className="social-logo" src="./insta.png" alt="instagram logo" /> </NavLink>
                    <NavLink> <img className="social-logo" src="./tiktok.png" alt="tiktok logo" /> </NavLink>
                    
                    
                </div>
            </footer>
        </>
    )
}