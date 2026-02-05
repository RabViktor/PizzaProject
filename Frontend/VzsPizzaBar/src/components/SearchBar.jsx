import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ isMobile }) {
    const [search, setSearch] = useState("");
    const navi = useNavigate();

    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            const res = await fetch("http://localhost:5000/api/products");
            const allProducts = await res.json();

            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            );

            navi("/menu", {
                state: {
                    searchTerm: search,
                    results: filtered
                }
            });

            setSearch("");
        }
    };

    return (
        <input
            type="text"
            placeholder="Keresés"
            className={isMobile ? "mobile-search" : "desktop-search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
        />
    );
}
