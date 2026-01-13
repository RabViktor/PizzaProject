import { createContext, useContext, useState, useEffect } from "react";
import { Toast } from "../components/Toast";

const CartContext = createContext();

export function CartProvider({ children }) {

    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const increase = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };


    const decrease = (id) => {
    setCartItems(prev =>
        prev.map(item =>
            item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
        .filter(item => item.quantity > 0)
    );
};


    const remove = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };



    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            cartCount,
            showToast,
            increase,
            decrease,
            remove
        }}>

            {children}

            {toast && <Toast message={toast} />}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
