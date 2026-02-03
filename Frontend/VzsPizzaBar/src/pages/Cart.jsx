import './Cart.css'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useRef } from 'react';

export function Cart(){
    const { cartItems, increase, decrease, remove } = useCart();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const navi = useNavigate();

    const topRef = useRef(null)

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        city: "",
        roadNum: "",
        comment: "",
        payment: ""
    })
    const [error, setError] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev, 
            [name]: value 
        }))
    }

    const isValidPhone = (phone) => {
        const pattern = /^(\+36|06)?\s?\d{2}\s?\d{3}\s?\d{4}$/
        return pattern.test(phone)
    }


    const handleChekout = async () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "A név megadása kötelező!"
        if (!form.phone.trim()) newErrors.phone = "A telefonszám kötelező!"
        else if (!isValidPhone(form.phone)) newErrors.phone = "Érvénytelen telefonszám!"
        if (!form.email.trim()) newErrors.email = "Az email megadása kötelező!"
        if (!form.city.trim() || form.city === "none") newErrors.city = "Válassz települést!"
        if (!form.roadNum.trim()) newErrors.roadNum = "A cím megadása kötelező!"
        if (!form.payment.trim()) newErrors.payment = "Válassz fizetési módot!"

        setError(newErrors)

        if (Object.keys(newErrors).length > 0) {
            topRef.current?.scrollIntoView({ behavior: "smooth" })
            return
        }

        console.log("Minden adat rendben, mehet a fizetés!")

        const response = await fetch(
            "https://lrkftgsvfgbzrxqnbvdf.supabase.co/functions/v1/create-checkout",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                items: cartItems,
                customerData: form
                })
            }
        )

        const data = await response.json();
        window.location.href = data.url;

    }


    return (
        <>
            <section className='datas-section' ref={topRef}>
                <div className='main-card'>
                    <h2 style={{color:"white"}}>Adatok</h2>
                    <div className='main-card-line'></div>
                    <section className='datas-card'>
                        <div className='data-card'>
                            <label htmlFor="name">Név:</label> <br />
                            <input type="text" name='name' id='name' value={form.name} onChange={handleChange} className={error.name ? "error-input" : ""}/>
                            {error.name && <p className="error">{error.name}</p>}
                        </div>
                        <div className="data-card">
                            <label htmlFor="phone">Telefonszám:</label> <br />
                            <input type="number" name='phone' id='phone' value={form.phone} onChange={handleChange} className={error.name ? "error-input" : ""}/>
                            {error.phone && <p className="error">{error.phone}</p>}
                        </div>
                        <div className="data-card">
                            <label htmlFor="email">E-mail:</label> <br />
                            <input type="email" name='email' id='email' value={form.email} onChange={handleChange} className={error.name ? "error-input" : ""}/>
                            {error.email && <p className="error">{error.email}</p>}
                        </div>
                        <div className="data-card">
                            <label htmlFor="city">Település:</label> <br />
                            <select name="city" id="city" value={form.city} onChange={handleChange} className={error.name ? "error-input" : ""}>
                                <option value="none">Válassz!</option>
                                <option value="szolnok">Szolnok</option>
                                <option value="toszeg">Tószeg</option>
                                <option value="szandaszolos">Szandaszőlős</option>
                            </select>
                            {error.city && <p className="error">{error.city}</p>}
                        </div>
                        <div className="data-card">
                            <label htmlFor="roadNum">Utca/házszám:</label> <br />   
                            <input type="text" name='roadNum' id='roadNum' value={form.roadNum} onChange={handleChange} className={error.name ? "error-input" : ""}/>
                            {error.roadNum && <p className="error">{error.roadNum}</p>}
                        </div>
                        <div className="data-card">
                            <label htmlFor="comment">Megjegyzés</label> <br />
                            <input type="text" name='comment' id='comment' value={form.comment} onChange={handleChange} />
                        </div>
                        <div className="data-card">
                            <label className="payment-label">Fizetési módok:</label>
                            <div className="payment-options">
                                <label className="payment-card">
                                    <input type="radio" name="payment" value="card" checked={form.payment === "card"}  onChange={handleChange} className={error.name ? "error-input" : ""}/> 
                                    <div className="payment-content">
                                        <h3>Bankkártya (online)</h3>
                                    </div>
                                </label>
                                <label className="payment-card">
                                    <input type="radio" name="payment" value="cash" checked={form.payment === "cash"} onChange={handleChange} className={error.name ? "error-input" : ""}/> 
                                    <div className="payment-content">
                                        <h3>Készpénz (futárnál)</h3>
                                    </div>
                                </label>
                            </div>
                            {error.payment && <p className="error">{error.payment}</p>}
                        </div>
                    </section>
                </div>
            </section>
            <div id='cart-div'>
                <div id="cart-card">
                    <div id="cart-list">
                        <div id="cart-text">
                            <h1>Kosár</h1>
                            <div className="line-cart"></div>
                        </div>

                        <div id="cart-products">
                            {cartItems.length === 0 && (<h2 className='empty-text'>Üres a kosár</h2>)}

                            {cartItems.map(item => (
                                <div 
                                    key={`${item.id}-${item.size}`} 
                                    className="cart-item"
                                >
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="cart-image" 
                                    />

                                    <div className="cart-details">
                                        <h3>{item.name} {item.category === "pizza" ? `- ${item.size} cm` : ""}</h3>

                                        <div id="price-quantity">
                                            <div className="quantity-controls">
                                                <button 
                                                    onClick={() => decrease(item.id, item.size)}
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button 
                                                    onClick={() => increase(item.id, item.size)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p>{item.price * item.quantity} Ft</p>
                                        </div>

                                        <button 
                                            className="remove" 
                                            onClick={() => remove(item.id, item.size)}
                                        >
                                            x
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div id='back-to-menu'>
                            <button onClick={() => navi('/menu')}>
                                Vissza az étlapra
                            </button>
                        </div>
                    </div>

                    <div id="cart-summary">
                        <div id="summary-text">
                            <h1>Összegzés</h1>
                            <div className="line-cart"></div>
                            <h3>Várható szállítás 1 órán belül</h3>
                        </div>

                        <div id="summary-list">
                            <ul>
                                {cartItems.map(item => (
                                    <li 
                                        className='sum-items' 
                                        key={`${item.id}-${item.size}-sum`}
                                    >
                                        <p>{item.name} {item.category === "pizza" ? `- ${item.size} cm` : ""}</p>

                                        <div id='sm-qp'>
                                            <p>{item.quantity} db</p>
                                            <p>{item.price * item.quantity} Ft</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div id="summary-price">
                            {cartItems.length !== 0 && (
                                <div id='delivery-text'>
                                    <p>Szállítási díj:</p>
                                    <p>990 Ft</p>
                                </div>
                            )}

                            <div className="line-cart"></div>

                            <div id="total-price">
                                <p className='price'>Összesen:</p>
                                <p className="price">
                                    {cartItems.length === 0 
                                        ? "0 Ft" 
                                        : `${total + 990} Ft`
                                    }
                                </p>
                            </div>

                            <div id='btn-div'>
                                <button onClick={handleChekout}>Pénztár</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
