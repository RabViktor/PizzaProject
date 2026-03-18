import { useState } from "react";
import "./SauceSelector.css";

export function SauceSelector({ price, onChange }) {
    const sauces = ["BBQ", "Curry-Mangó", "Édes-Savanyú", "Ketchup", "Majonéz", "Salsa"];

    const maxSauces = price > 3000 ? 2 : 1;
    const [selectedSauces, setSelectedSauces] = useState([]);

    const handleSelect = (sauce) => {
        let updated;

        if (selectedSauces.includes(sauce)) {
            updated = selectedSauces.filter(s => s !== sauce);
        } else {
            if (selectedSauces.length >= maxSauces) return;
            updated = [...selectedSauces, sauce];
        }

        setSelectedSauces(updated);
        onChange(updated); 
    };

    return (
        <div className="sauce-container">
            <span>Szósz (max {maxSauces}):</span>
            <div className="sauce-buttons">
                {sauces.map(sauce => (
                    <label key={sauce} className="sauce-option">
                        <input
                            type="checkbox"
                            className="sauce-checkbox"
                            checked={selectedSauces.includes(sauce)}
                            onChange={() => handleSelect(sauce)}
                            disabled={
                                !selectedSauces.includes(sauce) &&
                                selectedSauces.length >= maxSauces
                            }
                        />
                        <span>{sauce}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
