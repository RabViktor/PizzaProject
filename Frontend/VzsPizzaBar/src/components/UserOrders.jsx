import { useEffect, useState } from "react";
import "./UserOrders.css"

export default function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [openOrder, setOpenOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const userId = localStorage.getItem("id");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/orders?user_id=${userId}`);
        
        const data = await res.json();
        setOrders(data);
    };

    const toggleOrder = async (orderId) => {
    if (openOrder === orderId) {
        setOpenOrder(null);
        return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/order/${orderId}`);

    const data = await res.json();
    setOrderItems(data);
    setOpenOrder(orderId);
};


    return (
        <div className="orders-container">

            {orders.map(order => (
                <div key={order.id} className="order-card" style={{backgroundColor:"rgb(243, 229, 190)"}}>
                    <div className="order-header">
                        <p><b>Rendelés száma:</b> {order.order_number}</p>
                        <p><b>Dátum:</b> {new Date(order.created_at).toLocaleString()}</p>
                        <p><b>Státusz:</b> {order.status}</p>

                        <button onClick={() => toggleOrder(order.id)} className="btn-user-order">
                            {openOrder === order.id ? "Bezárás" : "Megtekintés"}
                        </button>
                    </div>

                    {openOrder === order.id && (
                        <div className="order-details">
                            {orderItems.map(item => (
                                <div key={item.id} className="order-item">
                                    <p><b>{item.products.name}</b></p>
                                    <p>Mennyiség: {item.quantity}</p>
                                    <p>Ár: {item.price_snapshot} Ft</p>
                                    {item.size && <p>Méret: {item.size} cm</p>}
                                    {item.sauce && <p>Szósz: {item.sauce}</p>}
                                    {item.extras && <p>Extrák: {item.extras}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
