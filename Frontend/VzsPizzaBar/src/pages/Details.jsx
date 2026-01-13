import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useCart } from "../context/CartContext"

export function Details({param}){
    const {id} = useParams()

    const {addToCart, showToast}= useCart()
    
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const sauces = ["BBQ", "Curry-Mangó", "Édes-Savanyú", "Ketchup", "Majonéz", "Salsa"];
    const [selectedSauces, setSelectedSauces] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        const leker = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);

                if (!res.ok) {
                    throw new Error("Nem sikerült lekérni a terméket");
                }

                const data = await res.json();
                setProduct(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        leker();
    }, [id]);


    const toggleSauce = (sauce) => {
        if (!product) return;
        const maxSelection = (product.price === 3300 || product.price === 3500) ? 2 : 1;
        if (selectedSauces.includes(sauce)) {
            setSelectedSauces(selectedSauces.filter((s) => s !== sauce));
        } else {   
            if (selectedSauces.length < maxSelection) {
                setSelectedSauces([...selectedSauces, sauce]);
            }
        }
    }

    return (
        <>
            {loading && <LoadingSpinner/>}
            {error && <p>Hiba: {error}</p>}
            {product && (
            <div style={{width:"70%", margin: "auto", marginTop:"70px", display: "flex", justifyContent:"space-between", flexDirection:"row"}} key={product.id}>
                <div>
                    <button onClick={() => nav("/menu")}>Vissza</button>
                    <img style={{width:"500px"}} src={product.image} alt={product.name} />
                </div>
                <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>

                    {/* Szószválasztó csak chicken kategóriánál */}
                    {product.category === "chicken" && (
                    <div style={{ marginTop: "20px" }}>
                        <h4>
                        Válassz szószt (
                        {(product.price === 3300 || product.price === 3500) ? 2 : 1} db)
                        </h4>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {sauces.map((sauce) => (
                            <button
                            key={sauce}
                            onClick={() => toggleSauce(sauce)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "5px",
                                border: selectedSauces.includes(sauce)
                                ? "2px solid blue"
                                : "1px solid gray",
                                backgroundColor: selectedSauces.includes(sauce)
                                ? "lightblue"
                                : "white",
                                cursor: "pointer",
                            }}
                            >
                            {sauce}
                            </button>
                        ))}
                        </div>
                        <p>Kiválasztott szósz(ok): {selectedSauces.join(", ") || "nincs"}</p>
                    </div>
                    )}
                    <p>Ár: {product.price} Ft</p>
                    <button onClick={() => {
                                    addToCart(product)
                                    showToast("Sikeresen hozzáadva a kosárhoz!")
                                }}>Kosárba</button>
                </div>
                
            </div>
            )}
        </>
    );

}