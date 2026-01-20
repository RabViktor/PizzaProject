import { NavLink, useNavigate } from "react-router-dom";
import "./Nav.css"
import { useState } from "react";
import { useCart } from "../context/CartContext";

export function Nav(){

    const navi = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const {cartCount} = useCart()

    const [open, setOpen] = useState(false)
    const [closing, setClosing] = useState(false);

    const LinkStlye = ({isActive}) => {
        return {
            color: isActive ? "#F3E5BE" : "#fff"
        }
    }

    const logout = async () => {
        const token = localStorage.getItem("token")

        await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        navi("/");
        window.location.reload()
    }


    const toggleMenu = () => {
        if (open) {
            setClosing(true); 
            setTimeout(() => {
                setOpen(false); 
                setClosing(false);
            }, 400); 
        } else {
            setOpen(true);
        }
    };



    return(
        <>
            <nav>
                <div className="logo">
                    <img className="logoI" src="/logo.png" alt="vzsLogo" />
                    <NavLink to={"/"} style={{textDecoration:"none"}}><h1>VZS&nbsp;PizzaBar</h1></NavLink>
                </div>
                
                <div className="hamburger" onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="navMiddle">
                    <NavLink to={"/cart"} className="menu">
                        <div style={{ position: "relative" }}>
                            <img style={{ marginTop: "15px" }} src="/basket-cart-icon.png" alt="kosár" />
                            {cartCount > 0 && (
                                <span style={{fontWeight:"normal", position: "absolute", top: "0", right: "-15px", background: "red", color: "white", borderRadius: "50%", padding: "3px 10px 0px 10px", fontSize: "29px" }} >
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </NavLink>
                </div>

                <div className="menuDiv" >
                    <NavLink className={"menu"} style={LinkStlye} to={"/"}>Főoldal </NavLink>
                    <NavLink className={"menu"} style={LinkStlye} to={"/menu"}>Étlap</NavLink>
                    <NavLink className={"menu"} style={LinkStlye} to={"/contact"}>Kapcsolat</NavLink>
                    <input type="text" placeholder="Keresés" />
                    <NavLink to={"/cart"} className={"menu"}>
                        <div style={{position:"relative"}}>
                            <img style={{marginTop:"15px"}} src="/basket-cart-icon.png" alt="kosár" />
                            {cartCount > 0 && (
                                    <span style={{ fontWeight:"normal", position: "absolute", top: "0", right: "-15px", background: "red", color: "white", borderRadius: "50%", padding: "3px 10px 0px 10px", fontSize: "30px" }} >
                                        {cartCount}
                                    </span>
                            )}
                        </div>
                    </NavLink>
                </div>

                <div className="authButtons">
                    {!user ? (
                        <>
                            <button onClick={() => navi("/login")} className="loginBtn" style={{backgroundColor:"#F3E5BE"}}>Belépés</button>
                            <button onClick={() => navi("/registration")} className="regBtn" style={{backgroundColor:"#EBBC69"}}>Regisztráció</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => logout()} className="loginBtn" style={{backgroundColor:"#F3E5BE"}}>Kijelentkezés</button>
                            <img
                                src="/profile-icon.jpg"
                                alt="Profil"
                                onClick={() => navi('/profile')}
                                
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    backgroundColor: "#EBBC69",
                                    padding: "5px",
                                    boxShadow: "0px 12px 23px -9px rgba(0,0,0,0.67)"
                                }}
                            />
                        </>
                    )}
                </div>



                {open && (
                    <div className={`mobileMenu ${closing ? "close" : "open"}`}>
                        <NavLink className={"menu"} style={LinkStlye} to={"/"} onClick={() => setOpen(false)}>Főoldal</NavLink>
                        <NavLink className={"menu"} style={LinkStlye} to={"/menu"} onClick={() => setOpen(false)}>Étlap</NavLink>
                        <NavLink className={"menu"} style={LinkStlye} to={"/contact"} onClick={() => setOpen(false)}>Kapcsolat</NavLink>
                        <input type="text" placeholder="Keresés" />
                        {!user ? (
                            <>
                                <button onClick={() => navi("/login")} className="loginBtn" style={{ backgroundColor: "#F3E5BE" }}>Belépés</button>
                                <button onClick={() => navi("/registration")} className="regBtn" style={{ backgroundColor: "#EBBC69" }}>Regisztráció</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => logout()} className="loginBtn" style={{backgroundColor:"#F3E5BE"}}>Kijelentkezés</button>
                                <img
                                    src="/profile-icon.jpg"
                                    alt="Profil"
                                    onClick={() => navi('/profile')}
                                    
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        backgroundColor: "#EBBC69",
                                        padding: "5px",
                                        boxShadow: "0px 12px 23px -9px rgba(0,0,0,0.67)"
                                    }}
                                />
                            </>
                        )}

                    </div>
                )}


            </nav>
            <div className="line"></div>

        </>
        
    )
}