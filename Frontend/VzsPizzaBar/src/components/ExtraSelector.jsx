import { useState } from "react";
import "./ExtraSelector.css";

export function ExtraSelector({ max = 8, onChange }) {
    const extras = [
        "Extra sajt",
        "Bacon",
        "Sonka",
        "Pepperoni",
        "Kukorica",
        "Hagyma",
        "Gomba",
        "Jalapeno",
        "BBQ szósz",
        "Fokhagymás szósz"
    ];

    const [selected, setSelected] = useState([]);

    const toggleExtra = (extra) => {
        let updated;

        if (selected.includes(extra)) {
            updated = selected.filter(e => e !== extra);
        } else {
            if (selected.length >= max) return; // max 8
            updated = [...selected, extra];
        }

        setSelected(updated);
        onChange(updated);
    };

    return (
        <div className="extra-selector">
            <h3>Plusz feltétek (max {max}):</h3>

            <div className="extra-grid">
                {extras.map(extra => (
                    <button
                        key={extra}
                        className={selected.includes(extra) ? "extra active" : "extra"}
                        onClick={() => toggleExtra(extra)}
                    >
                        {extra}
                    </button>
                ))}
            </div>
        </div>
    );
}
