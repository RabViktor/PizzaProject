import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Dashboard() {

    const [stats, setStats] = useState(null);
    const [statusStats, setStatusStats] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchStatusStats();
    }, []);

    const fetchStats = async () => {
        const res = await fetch("http://localhost:5000/api/admin/stats");
        const data = await res.json();
        setStats(data);
    };

    const fetchStatusStats = async () => {
        const res = await fetch("http://localhost:5000/api/admin/order-status-stats");
        const data = await res.json();
        setStatusStats(data);
    };

    if (!stats || !statusStats) {
        return <h2 style={{ padding: "20px" }}>Betöltés...</h2>;
    }

    const pieData = {
        labels: ["Függőben", "Készül", "Kiszállítás alatt", "Kész", "Törölve"],
        datasets: [
            {
                data: [
                    statusStats.pending,
                    statusStats.in_progress,
                    statusStats.delivering,
                    statusStats.completed,
                    statusStats.cancelled
                ],
                backgroundColor: [
                    "#F3E5BE",
                    "#EBBC69",
                    "#BC271C",
                    "#4CAF50",
                    "#555"
                ],
                borderWidth: 1
            }
        ]
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "48px", marginBottom: "30px" }}>Dashboard</h1>

            {/* Statisztikai kártyák */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginBottom: "40px"
            }}>
                <div className="stat-card">
                    <h2>Mai rendelések</h2>
                    <p>{stats.todayOrders}</p>
                </div>

                <div className="stat-card">
                    <h2>Heti rendelések</h2>
                    <p>{stats.weeklyOrders}</p>
                </div>

                <div className="stat-card">
                    <h2>Mai bevétel</h2>
                    <p>{stats.todayRevenue.toLocaleString()} Ft</p>
                </div>

                <div className="stat-card">
                    <h2>Aktív rendelések</h2>
                    <p>{stats.activeOrders}</p>
                </div>
            </div>

            {/* Kördiagram */}
            <div style={{
                width: "500px",
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(0,0,0,0.2)"
            }}>
                <h2 style={{ marginBottom: "20px" }}>Rendelések megoszlása</h2>
                <Pie data={pieData} />
            </div>
        </div>
    );
}
