import { useEffect, useState } from "react";
import "./Orders.css";
import { useCart } from "../context/CartContext";

export function Orders() {
    const [orders, setOrders] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const { showToast } = useCart();

    const fetchOrders = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`);
        const data = await res.json();
        setOrders(data);
    };

    const fetchCouriers = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`);
        const data = await res.json();
        setCouriers(data.filter(u => u.role === "courier"));
    };

    useEffect(() => {
        fetchOrders();
        fetchCouriers();
    }, []);

    const filtered = orders.filter(order => {
        const matchesSearch =
            order.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.phone?.includes(search) ||
            order.id?.toString().includes(search);

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id, newStatus) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        showToast("Státusz frissítve");
        fetchOrders();
    };

    const assignCourier = async (id, courierId) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}/courier`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courier_id: courierId })
        });

        showToast("Futár hozzárendelve");
        fetchOrders();
    };

    const statusColors = {
        pending: "#f1c40f",
        in_progress: "#3498db",
        delivering: "#e67e22",
        completed: "#2ecc71",
        cancelled: "#e74c3c"
    };

    return (
        <div className="orders-container">
            <h1 className="orders-title">Rendelések</h1>

            {/* Szűrők */}
            <div className="orders-filters">
                <input
                    type="text"
                    placeholder="Keresés név, telefon vagy ID alapján..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Összes státusz</option>
                    <option value="pending">Függőben</option>
                    <option value="in_progress">Folyamatban</option>
                    <option value="delivering">Kiszállítás alatt</option>
                    <option value="completed">Teljesítve</option>
                    <option value="cancelled">Törölve</option>
                </select>
            </div>

            {/* Rendelés lista */}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Telefon</th>
                        <th>Cím</th>
                        <th>Fizetés</th>
                        <th>Összeg</th>
                        <th>Státusz</th>
                        <th>Futár</th>
                        <th>Dátum</th>
                        <th>Részletek</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.phone}</td>
                            <td>{order.address}</td>
                            <td>{order.payment_method}</td>
                            <td>{order.total_price} Ft</td>

                            <td>
                                <p
                                    className="status-badge"
                                    style={{ backgroundColor: statusColors[order.status] }}
                                >
                                    {order.status}
                                </p>
                            </td>

                            <td>
                                <select
                                    className="courier-select"
                                    value={order.courier_id || ""}
                                    onChange={(e) => assignCourier(order.id, e.target.value)}
                                >
                                    <option value="">Nincs futár</option>
                                    {couriers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td>{new Date(order.created_at).toLocaleString()}</td>

                            <td>
                                <button
                                    className="details-btn"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    Részletek
                                </button>
                            </td>

                            <td>
                                <select
                                    className="status-select"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                >
                                    <option value="pending">Függőben</option>
                                    <option value="in_progress">Folyamatban</option>
                                    <option value="delivering">Kiszállítás alatt</option>
                                    <option value="completed">Teljesítve</option>
                                    <option value="cancelled">Törölve</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ⭐ MODAL – RENDELÉS RÉSZLETEK */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Rendelés #{selectedOrder.id}</h2>
                        <p><strong>Cím:</strong> {selectedOrder.address}</p>
                        <p><strong>Telefon:</strong> {selectedOrder.phone}</p>
                        <p><strong>Fizetés:</strong> {selectedOrder.payment_method}</p>
                        <p><strong>Összeg:</strong> {selectedOrder.total_price} Ft</p>

                        <h3 style={{fontSize:"38px"}}>Rendelt tételek:</h3>

                        {selectedOrder.order_items?.map(item => (
                            <div key={item.id} className="modal-item">
                                <p><strong>Termék:</strong> {item.products?.name}</p>
                                <p><strong>Mennyiség:</strong> {item.quantity} db</p>

                                {item.size && <p><strong>Méret:</strong> {item.size}</p>}

                                {item.sauce && (
                                    <p><strong>Szószok:</strong> {item.sauce}</p>
                                )}

                                {item.extras && (
                                    <p><strong>Plusz feltétek:</strong> {item.extras} 
                                    {item.extra_price > 0 && ` (+${item.extra_price} Ft)`}</p>
                                )}

                                <p><strong>Ár:</strong> {item.price_snapshot} Ft</p>
                            </div>
                        ))}

                        <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                            Bezárás
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
