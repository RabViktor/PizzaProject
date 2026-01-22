import './QuantitySelector.css'

export function QuantitySelector({value, onChange}){
    
    const increase = () => onChange(value + 1)
    const decrease = () => {
        if(value > 1) onChange(value - 1)
    }

    return(
        <div className="qty-container">
            <span>Mennyiség:</span>
            <button className="qty-btn" onClick={decrease}>-</button>
            <span className="qty-value">{value}</span>
            <button className="qty-btn" onClick={increase}>+</button>
        </div>
    )
}