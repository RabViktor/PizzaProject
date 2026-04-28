import { useEffect, useState } from "react";
import "./CourierPanel.css";

export function CourierPanel() {
    const courier = JSON.parse(localStorage.getItem("courier"));
    const courierId = courier?.user?.id;

    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        completedToday: 0,
        cashTotal: 0,
        cardTotal: 0,
        remaining: 0
    });

    const fetchOrders = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courier/orders/${courierId}`);
        const data = await res.json();
        setOrders(data);

        calculateStats(data);
    };

    const calculateStats = (orders) => {
        const today = new Date().toISOString().split("T")[0];

        let completedToday = 0;
        let cashTotal = 0;
        let cardTotal = 0;
        let remaining = 0;

        orders.forEach(o => {
            const orderDate = o.created_at.split("T")[0];

            if (o.status === "completed" && orderDate === today) {
                completedToday++;
            }

            if (o.status !== "completed") {
                remaining++;
            }

            if (o.payment_method === "cash") {
                cashTotal += o.total_price;
            } else if (o.payment_method === "card") {
                cardTotal += o.total_price;
            }
        });

        setStats({ completedToday, cashTotal, cardTotal, remaining });
    };

    const completeOrder = async (id) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/courier/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" })
        });

        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="courier-panel">
            {/* Statisztika kártyák */}
            <div className="stats-grid-c">  
                <div className="stat-card-c">
                    <h3>Készpénz összesen</h3>
                    <p>{stats.cashTotal} Ft</p>
                </div>

                <div className="stat-card-c">
                    <h3>Kártyás összesen</h3>
                    <p>{stats.cardTotal} Ft</p>
                </div>

                <div className="stat-card-c">
                    <h3>Hátralévő címek</h3>
                    <p>{stats.remaining} db</p>
                </div>
            </div>

            {/* Rendelés kártyák */}
            <div className="orders-list">
                {orders
                    .filter(o => o.status !== "completed")
                    .map(order => (
                        <div className="order-card" key={order.id}>
                            <h2>Név: {order.user_name}</h2>

                            <p>Rendelés szám: #{order.order_number}</p>

                            <p>
                                <strong>Cím:</strong>{" "}
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {order.address}
                                </a>
                            </p>

                            <p>
                                <strong>Telefon:</strong>{" "}
                                <a href={`tel:${order.phone}`}>
                                    {order.phone}
                                </a>
                            </p>

                            <p><strong>Fizetés:</strong> {order.payment_method}</p>
                            <p><strong>Összeg:</strong> {order.total_price} Ft</p>

                            <button
                                className="complete-btn"
                                onClick={() => completeOrder(order.id)}
                            >
                                Kézbesítve
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
