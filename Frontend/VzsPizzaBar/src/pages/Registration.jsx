import { NavLink } from "react-router-dom"
import "./Registration.css"

export function Registration(){

    const send = async (e) => {
        e.preventDefault();

        const form = e.target;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phonePrefix = document.getElementById("phone-num").value;
        const phoneNumber = document.getElementById("phone_number").value.trim();
        const password = form.password.value;
        const passwordAgain = form["password-again"].value;
        const accepted = document.getElementById("checkbox").checked;

        
        if (!accepted) {
            alert("Fogadd el a feltételeket!");
            return;
        }

        if (!name || !email || !phonePrefix || phonePrefix === "none" || !phoneNumber) {
            alert("Minden mezőt tölts ki!");
            return;
        }

        if (password !== passwordAgain) {
            alert("A két jelszó nem egyezik!");
            return;
        }

        const fullPhone = `+36${phonePrefix}${phoneNumber}`;

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phone: fullPhone,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Hiba: " + data.error);
                return;
            }

            alert("Sikeres regisztráció!");

        } catch (err) {
            alert("Hálózati hiba történt!");
            console.error(err);
        }
    };


    return(
        <>
            <div className="reg-div">
                <form className="reg-form" onSubmit={send}>
                    <div className="reg-h2">
                        <h2>Regisztráció</h2>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", flexDirection:"column", padding:"0 50px"}}>
                        <div>
                            <label htmlFor="name">Név:</label> <br />
                            <input type="text" name="name" />
                        </div>
                        <div>
                            <label htmlFor="email">E-mail cím:</label><br />
                            <input type="text" name="email" />
                        </div>
                        <div>
                            <label htmlFor="phone">Telefonszám:</label>
                            <div>
                                <input style={{width:"50px"}} type="number" placeholder="+36" disabled/>
                                <select id="phone-num">
                                    <option value="none">Válassz!</option>
                                    <option value="30">30</option>
                                    <option value="20">20</option>
                                    <option value="70">70</option>
                                    <option value="50">50</option>
                                </select>
                                <input id="phone_number" type="number"name="phone" maxLength={"7"} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password">Jelszó:</label><br />
                            <input type="password" name="password" />
                        </div>

                        <div>
                            <label htmlFor="password-again">Jelszó mégegyszer:</label><br />
                            <input type="password" name="password-again" />
                        </div>
                        <div style={{display:"flex", gap:'0'}}>
                            <input id="checkbox" className="box" type="checkbox" name="box"/>
                            <label htmlFor="box" style={{fontSize:"32px", padding:"10px"}}>Elolvastam és elfogadom a felhasználási feltételeket.</label>
                        </div>

                        <div>
                            <button type="submit" className="reg-btn">Regisztráció</button>
                        </div>
                        
                    </div>
                </form>
                
                
            </div>
           

        </>
    )
}