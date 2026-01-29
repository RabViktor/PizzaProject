import "./Contact.css";


export function Contact(){
    return(
        <>
           <section className="contact-info">
            <div className="contact-cards">
                <div className="contact-card">
                    <img className="kep" src="/location.png" alt="" />
                    <p className="con">Helyszín</p>
                    <p className="desc"> 5000 Szolnok, Áchim András utca 12-14</p>
                </div>
                <div className="contact-card">
                    <img className="kepp" src="/mail.png" alt="" />
                    <p className="con">E-mail</p>
                    <p className="desc">noreply@vzspizzabar.hu</p>
                </div>
                <div className="contact-card">
                    <img className="kepo" src="/phone.png" alt="" />
                    <p className="con">Telefon</p>
                    <p className="desc">+36 70 123 4567</p>
                </div>
            </div>
           </section>

           <div className="contact-div">
            <form className="contact-form">
                <div className="login-h2">
                    <h2>Írj nekünk</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "0 50px" }}>
                <div>
                  <label htmlFor="name">Teljes név:</label><br />
                  <input
                    id="name"
                    type="text"
                    name="name"
                  />
                </div>
                <div>
                  <label htmlFor="email">E-mail cím:</label><br />
                  <input
                    id="email"
                    type="text"
                    name="email"
                  />
                </div>
                <div>
                    <label htmlFor="message"></label><br />
                    <textarea className="mess"></textarea>
                </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <button type="submit" className="con-btn">Küldés</button>
                </div>

            </form>
           </div>
           
        </>
    )
}