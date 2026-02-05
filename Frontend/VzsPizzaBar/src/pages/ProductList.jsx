import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CategoryFilter } from "../components/CategoryFilter";
import "./ProductList.css";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCart } from "../context/CartContext";

export function ProductList() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const urlCategory = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(urlCategory || "pizza");

    const { addToCart, showToast } = useCart();

    // keresési adatok a SearchBar-ból
    const location = useLocation();
    const searchTerm = location.state?.searchTerm || "";
    const searchResults = location.state?.results || null;

    // ha nincs keresés → kategória alapján fetch
    useEffect(() => {
        if (searchTerm) {
            setLoading(false);
            return;
        }

        const leker = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products?category=${selectedCategory}`);

                if (!res.ok) {
                    throw new Error("Hiba történt a termékek lekérésekor");
                }

                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        leker();
    }, [selectedCategory, searchTerm]);

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    // melyik lista jelenjen meg?
    const listToShow = searchTerm ? searchResults : products;

    return (
        <>
            {/* Kategória szűrő csak akkor, ha nincs keresés */}
            {!searchTerm && !loading && (
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            )}

            {searchTerm && (
                <h2 className="resultText">
                    Találatok a következőre: <span>{searchTerm}</span>
                </h2>
            )}

            {loading && <LoadingSpinner />}
            {error && <h2>{error}</h2>}

            <div id="products-div">

                {/* Nincs találat */}
                {searchTerm && listToShow?.length === 0 && (
                    <div className="nonResultDiv">
                        <img src="/magnifying-glass.png" alt="icon" />
                        <h2 className="nonResultText">
                            Nincs találat a következőre: <span style={{ color: "#BC271C" }}>{searchTerm}</span>
                        </h2>
                    </div>
                )}

                {/* Találatok listázása */}
                {listToShow && listToShow.length > 0 && listToShow.map(product => (
                    <div key={product.id} style={{
                        width: "250px",
                        backgroundColor: "#BC271C",
                        padding: "13px",
                        borderRadius: "7px",
                        border: "4px solid black"
                    }}>
                        <Link
                            style={{ textDecoration: "none", color: "black" }}
                            to={`/menu/details/${product.id}?category=${selectedCategory}`}
                        >
                            <div className="boxka">
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img
                                        className="product-image"
                                        style={{ maxWidth: "250px", width: "100%", objectFit: "cover" }}
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>
                                <h2 className="asd">{truncateText(product.name, 22)}</h2>
                                <p>{truncateText(product.description, 33)}</p>
                            </div>
                        </Link>

                        <div className="valami" style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <button
                                id="addToCartBtn"
                                onClick={() => {
                                    if (product.category === "pizza") {
                                        addToCart({
                                            ...product,
                                            size: "28",
                                            price: product.price,
                                            quantity: 1
                                        });
                                    } else {
                                        addToCart({
                                            ...product,
                                            quantity: 1
                                        });
                                    }
                                    showToast("Sikeresen hozzáadva a kosárhoz!");
                                }}
                            >
                                Kosárba
                            </button>
                            <h2>{product.price} Ft</h2>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
