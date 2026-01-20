import './Details.css'
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

    return (
        <>
            {loading && <LoadingSpinner/>}
            {error && <h2>Hiba: {error}</h2>}
            {product && (
            <div id='product-div' key={product.id}>
                <div id="product-card">
                    <button onClick={() => nav("/menu")}>
                        <img src="/back.png" alt="vissza" />
                    </button>
                    <div>
                        <div id='left-content'>
                            <img id='product-image' src={product.image} alt={product.name} />
                        </div>
                        <div id='right-content'>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Ár: {product.price} Ft</p>
                            <button onClick={() => {
                                addToCart(product)
                                showToast("Sikeresen hozzáadva a kosárhoz!")
                            }}>Kosárba</button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );

}