import { useEffect, useState } from "react";
import "./Products.css";
import { useCart } from "../context/CartContext";

export function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const { showToast } = useCart();

    const [editModal, setEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        name: "",
        category: "",
        price: "",
        image: "",
        description: ""
    });


    const [form, setForm] = useState({
        name: "",
        category: "pizza",
        price: "",
        image: "",
        description: ""
    });

    const fetchProducts = async () => {
        const res = await fetch("http://localhost:5000/api/admin/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = products.filter(p =>
        (category === "all" || p.category === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const addProduct = async () => {
        await fetch("http://localhost:5000/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        showToast("Új termék hozzáadva");

        setForm({
            name: "",
            category: "pizza",
            price: "",
            image: "",
            description: ""
        });

        fetchProducts();
    };

    const deleteProduct = async (id) => {
        await fetch(`http://localhost:5000/api/admin/products/${id}`, {
            method: "DELETE"
        });
        showToast("Sikeresen törölve");
        fetchProducts();
    };

    const toggleProduct = async (id, available) => {
        await fetch(`http://localhost:5000/api/admin/products/${id}/toggle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ available })
        });
        showToast("Sikeres mentés");
        fetchProducts();
    };

    const openEdit = (product) => {
        setEditForm({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description || ""
        });
        setEditModal(true);
    };

    const saveEdit = async () => {
        await fetch(`http://localhost:5000/api/admin/products/${editForm.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: editForm.name,
                category: editForm.category,
                price: editForm.price,
                image: editForm.image,
                description: editForm.description
            })
        });

        showToast("Sikeresen mentve");

        setEditModal(false);
        fetchProducts();
    };



    return (
        <div className="products-container">
            <h1 className="products-title">Termékek</h1>

            {/* Szűrők */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Keresés név szerint..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">Összes kategória</option>
                    <option value="pizza">Pizza</option>
                    <option value="gyros">Gyros</option>
                    <option value="chicken">Csirke</option>
                    <option value="sauce">Szósz</option>
                    <option value="drink">Ital</option>
                    <option value="dessert">Desszert</option>
                </select>
            </div>

            {/* Új termék */}

            <h2 style={{fontSize:"40px"}}>Új termék</h2>

            <div className="add-product">
                <input placeholder="Név" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Ár" type="number" onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input placeholder="Kép URL" onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <input placeholder="Leírás" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/>


                <select className="add-product-select" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="pizza">Pizza</option>
                    <option value="gyros">Gyros</option>
                    <option value="chicken">Csirke</option>
                    <option value="sauce">Szósz</option>
                    <option value="drink">Ital</option>
                    <option value="dessert">Desszert</option>
                </select>

                <button className="add-product-btn" onClick={addProduct}>Hozzáadás</button>
            </div>

            {editModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Termék szerkesztése</h2>

                        <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Név"
                        />

                        <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            placeholder="Ár"
                        />

                        <input
                            value={editForm.image}
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                            placeholder="Kép URL"
                        />

                        <input 
                            placeholder="Leírás" 
                            value={editForm.description} 
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />


                        <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        >
                            <option value="pizza">Pizza</option>
                            <option value="gyros">Gyros</option>
                            <option value="chicken">Csirke</option>
                            <option value="sauce">Szósz</option>
                            <option value="drink">Ital</option>
                            <option value="dessert">Desszert</option>
                        </select>

                        <div className="modal-actions">
                            <button onClick={saveEdit}>Mentés</button>
                            <button onClick={() => setEditModal(false)}>Mégse</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Terméklista */}
            <div className="products-list">
                {filtered.map(product => (
                    <div className="product-card-admin" key={product.id}>
                        <img src={product.image} alt={product.name} />

                        <h2>{product.name}</h2>
                        <p className="category">{product.category}</p>
                        <p className="price">{product.price} Ft</p>

                        <div className="actions">
                            <button onClick={() => openEdit(product)}>Szerkesztés</button>
                            <button onClick={() => deleteProduct(product.id)}>Törlés</button>
                            <button onClick={() => toggleProduct(product.id, !product.available)}>
                                {product.available ? "Inaktív" : "Aktív"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
