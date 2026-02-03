import './Success.css'
import { useNavigate } from 'react-router-dom'


export function Success(){

    const navi = useNavigate()

    return(
        <div className="success-div">
            <div className="success-card">
                <img className="success-img" src="/success.png" alt="Pipa" />
                <h2>Sikeres Fizetés</h2>
                <p>Rendelés szám:</p>
            </div>
            <button onClick={() => navi('/')}>Vissza a főoldalra</button>
        </div>
    )
}