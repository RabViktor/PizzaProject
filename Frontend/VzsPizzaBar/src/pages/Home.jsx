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
                <h2>Kategóriák</h2>
                <div className="category-grid">
                    <div className="category-card" onClick={() => navi('/menu?category=pizza')}>
                        <img src="/categories/pizza.jpg" alt="Pizza" />
                        <button>Pizza</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=gyros')}>
                        <img src="/categories/gyros.jpg" alt="Gyros" />
                        <button>Gyros</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=chicken')}>
                        <img src="/categories/chicken.png" alt="Csirke" />
                        <button>Csirke</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=sauce')}>
                        <img src="/categories/sauce.jpg" alt="Szósz" />
                        <button>Szósz</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=dessert')}>
                        <img src="/categories/dessert.jpg" alt="Desszert" />
                        <button>Desszert</button>
                    </div>
                    <div className="category-card" onClick={() => navi('/menu?category=drink')}>
                        <img src="/categories/drink.jpg" alt="Ital" />
                        <button>Ital</button>
                    </div>
                </div>
            </section>

        </>
    )
}