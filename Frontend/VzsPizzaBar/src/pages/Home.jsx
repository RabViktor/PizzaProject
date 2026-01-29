import './Home.css'
import { useNavigate } from 'react-router-dom'

export function Home(){

    const navi = useNavigate()

    return(
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1>VZS PizzaBar</h1>
                    <p>Szolnok legjobb pizzái!</p>
                    <button onClick={() => navi('/menu')}>Rendelés</button>
                </div>
                <img className='hero-logo' src="/logo.png" alt="logo" />
            </section>
            <section className='section-category'>
                <h1>Üdvözöljük a VZS PizzaBar weboldalán!</h1>
                <h2>Kategóriák</h2>
                <div className="category-grid">
                    <div className="category-card" onClick={() => navi('/menu?category=pizza')}>
                        <img src="/categories/kolbaszos.jpg" alt="Pizza" />
                        <button>Pizza</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=gyros')}>
                        <img src="/categories/Falafel_gyro.png" alt="Gyros" />
                        <button>Gyros</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=chicken')}>
                        <img src="/categories/12wing.png" alt="Csirke" />
                        <button>Csirke</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=sauce')}>
                        <img src="/categories/salsa.jpg" alt="Szósz" />
                        <button>Szósz</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=dessert')}>
                        <img src="/categories/magnum_lemonade.jpg" alt="Desszert" />
                        <button>Desszert</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=drink')}>
                        <img src="/categories/033PepsiBlack (1).jpg" alt="Ital" />
                        <button>Ital</button>
                    </div>
                </div>
            </section>

            <section className='section-contact'>
                <div className='contact-content'>
                    <button onClick={() => navi('/contact')}>Lépj velünk kapcsolatba!</button>
                </div>
            </section>

        </>
    )
}