import './Cart.css'
import { useCart } from '../context/CartContext'

export function Cart(){
    const { cartItems, increase, decrease, remove } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity,0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);



    return(
        <>
            <div id='cart-div'>
                <div id="cart-card">
                    <div id="cart-list">
                        <div id="cart-text">
                            <h1>Kosár</h1>
                            <div className="line-cart"></div>
                        </div>
                        <div id="cart-products">
                            {cartItems.length === 0 && <h2 className='empty-text'>Üres a kosár</h2>}
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-image" />
                                    <div className="cart-details">
                                        <h3>{item.name}</h3>
                                        <div id="price-quantity">
                                            <div className="quantity-controls">
                                                <button onClick={() => decrease(item.id)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => increase(item.id)}>+</button>
                                            </div>
                                            <p>{item.price * item.quantity} Ft</p>
                                        </div>
                                        <button className="remove" onClick={() => remove(item.id)}>x</button>
                                    </div>
                                    
                                </div>
                            ))}
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
                                    <li className='sum-items' key={item.id}>
                                        <p>{item.name}</p>
                                        <div id='sm-qp'>
                                            <p>{item.quantity} db</p>
                                            <p>{item.price * item.quantity} Ft</p>
                                        </div>
                                        
                                    </li>
                                ))}
                            </ul>
                            
                        </div>
                        <div id="summary-price">
                            {cartItems.length != 0 && (
                                <div 
                                id='delivery-text'>
                                    <p>Szállítási díj:</p>
                                    <p>990 Ft</p>
                                </div>
                            )}
                            <div className="line-cart"></div>
                            <div id="total-price">
                                <p className='price'>Összesen:</p>
                                <p className="price">{cartItems.length == 0 ? "0 Ft": `${total + 990} Ft`}</p>
                            </div>
                            <div id='btn-div'>
                                <button>Pénztár</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}