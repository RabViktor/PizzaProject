import { useEffect, useState } from "react";
import "./Users.css";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCart } from "../context/CartContext";

export function Users() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    const {showToast} = useCart();

    const fetchUsers = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`);
        const data = await res.json();
        setUsers(data);
        setLoading(false);
    };

    const nextRole = (current) => {
        if (current === "user") return "courier";
        if (current === "courier") return "admin";
        return "user"; // admin → user
    };

    const updateRole = async (id, newRole) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, role: newRole })
        });

        const data = await res.json();

        if (data.error) {
            alert("Hiba történt: " + data.error);
            return;
        }else{
            showToast("Sikeresen frissült a szerepkör");
        }

        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="users-container">
            <h1>Felhasználók</h1>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Szerep</th>
                        <th>Művelet</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className={`role ${user.role}`}>
                                {user.role}
                            </td>
                            <td>
                                <button
                                    className="role-btn"
                                    onClick={() =>
                                        updateRole(user.id, nextRole(user.role))
                                    }
                                >
                                    {user.role === "user" && "User → Futár"}
                                    {user.role === "courier" && "Futár → Admin"}
                                    {user.role === "admin" && "Admin → User"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
