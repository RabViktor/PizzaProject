import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { LoadingSpinner } from "../components/LoadingSpinner";
import "./Dashboard.css"

ChartJS.register(ArcElement, Tooltip, Legend);

export function Dashboard() {
    const [orders, setOrders] = useState(null);
    const [stats, setStats] = useState(null);
    const [statusStats, setStatusStats] = useState(null);

    

    const fetchStats = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`);
        const data = await res.json();
        setStats(data);
    };

    const fetchOrders = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`);
        const data = await res.json();
        setOrders(data);        
    }

    const fetchStatusStats = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/order-status-stats`);
        const data = await res.json();
        setStatusStats(data);
    };

    useEffect(() => {
        fetchOrders();
        fetchStats();
        fetchStatusStats();
    }, []);

    if (!stats || !statusStats) {
        return <LoadingSpinner/>;
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
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Statisztikai kártyák */}
            <div className="stat-grid">
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
            <div className="pie-container">
                <h2 className="pie-title">Rendelések megoszlása</h2>
                <Pie data={pieData} />
            </div>
        </div>
    );

}
