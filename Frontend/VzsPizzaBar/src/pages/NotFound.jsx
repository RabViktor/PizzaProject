import './NotFound.css'
import { useNavigate } from 'react-router-dom'

export function NotFound(){
    const nav = useNavigate()
    return(
        <>
            <div id='div-404'>
                <div id='card-404'>
                    <h1>404</h1>
                    <p>Az oldal nem található</p>
                    <button onClick={() => nav("/")} id='button-404'>Vissza a főoldalra</button>
                </div>
            </div>
        </>
    )
}