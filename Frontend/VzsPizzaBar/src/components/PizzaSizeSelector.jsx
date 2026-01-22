import './PizzaSizeSelector.css'

export function PizzaSizeSelector({selectedSize, onChange}){
    
    const sizes = [
        {value:"28", label:"28cm", extra: 0},
        {value:"50", label:"50cm", extra: 1500}
    ]
    
    return(
        <div className="size-container">
            <span>Méret:</span>
            <div className="size-buttons">
                {sizes.map(size => (
                    <label key={size.value} className="size-option">
                        <input type="radio"
                            name="pizza-size"
                            value={size.value}
                            checked={selectedSize?.value === size.value}
                            onChange={() => onChange(size)}    
                        />
                        <span>{size.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}