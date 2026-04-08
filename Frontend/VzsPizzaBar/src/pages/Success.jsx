import './Success.css'
import { useLocation, useNavigate } from 'react-router-dom'


export function Success(){

    const navi = useNavigate()
    const location = useLocation();
    const data = location.state;

    return(
        <div className="success-div">
            <div className="success-card">
                <img className="success-img" src="/success.png" alt="Pipa" />
                <h2>Sikeres {data?.method === "cash" ? "rendelés" : "fizetés"}</h2>
                <p>Rendelés szám:</p>
            </div>
            <button onClick={() => navi('/')}>Vissza a főoldalra</button>
        </div>
    )
}