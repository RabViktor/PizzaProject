import './Details.css'
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useCart } from "../context/CartContext"
import { QuantitySelector } from '../components/QuantitySelector'
import { PizzaSizeSelector } from '../components/PizzaSizeSelector'

export function Details(){
    const {id} = useParams()

    const {addToCart, showToast} = useCart()

    const [searchParams] = useSearchParams()
    const fromCategory = searchParams.get('category')

    const [category, setCategory] = useState(null)

    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState(null)
    
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const nav = useNavigate();

    const finalPrice = product && selectedSize
        ? product.price + selectedSize.extra
        : product?.price



    useEffect(() => {
        const leker = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);

                if (!res.ok) {
                    throw new Error("Nem sikerült lekérni a terméket");
                }

                const data = await res.json();
                setProduct(data);
                setCategory(data.category);
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
                <div id="product-helper">
                    <button id='back-button' onClick={() => nav(`/menu?category=${fromCategory}`)}>
                        <img id='back-image' src="/back.png" alt="vissza" />
                    </button>
                    <div id='product-card'>
                        <div id='left-content'>
                            <img id='product-image' src={product.image} alt={product.name} />
                        </div>
                        <div id='right-content'>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>

                            {category === "pizza" && (
                                <PizzaSizeSelector 
                                    selectedSize={selectedSize} 
                                    onChange={setSelectedSize}
                                />
                            )}

                            <QuantitySelector value={quantity} onChange={setQuantity} />

                            <div id='btn-price'>
                                <button
                                    onClick={() => {
                                        if (category === "pizza" && !selectedSize) {
                                            showToast("Válassz méretet!");
                                            return;
                                        }

                                        const itemToAdd = {
                                            ...product,
                                            quantity,
                                            price: finalPrice
                                        };

                                        if (category === "pizza") {
                                            itemToAdd.size = selectedSize.value;
                                        }

                                        addToCart(itemToAdd);
                                        showToast("Sikeresen hozzáadva a kosárhoz!");
                                    }}
                                >
                                    Kosárba
                                </button>

                                <p>{finalPrice} Ft</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );

}