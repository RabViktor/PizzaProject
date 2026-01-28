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
                    <img className="kep" src="/phone.png" alt="" />
                    <p className="con">Telefon</p>
                    <p className="desc">+36 70 123 4567</p>
                </div>
            </div>
           </section>
           
        </>
    )
}