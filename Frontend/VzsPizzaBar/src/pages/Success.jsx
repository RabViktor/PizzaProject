import { useEffect, useState } from 'react';
import './Success.css'
import { useLocation, useNavigate } from 'react-router-dom'


export function Success() {
    const navi = useNavigate();
    const location = useLocation();

    const [orderNumber, setOrderNumber] = useState(null);
    const [method, setMethod] = useState(null);

    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");

    useEffect(() => {
        if (sessionId) {
            fetch(`http://localhost:5000/api/stripe-session/${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setOrderNumber(data.orderNumber);
                    setMethod(data.method);
                });
        } else {
            // készpénzes fizetés
            const state = location.state;
            setOrderNumber(state?.orderNumber);
            setMethod("cash");
        }
    }, []);

    return(
        <div className="success-div">
            <div className="success-card">
                <img className="success-img" src="/success.png" alt="Pipa" />
                <h2>Sikeres {method === "cash" ? "rendelés" : "fizetés"}</h2>
                <p>Rendelés szám: <strong>{orderNumber}</strong></p>
            </div>
            <button onClick={() => navi('/')}>Vissza a főoldalra</button>
        </div>
    )
}