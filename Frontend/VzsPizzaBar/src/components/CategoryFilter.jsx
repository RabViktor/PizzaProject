import "./CategoryFilter.css"

export function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const categories = ["pizza", "gyros", "chicken","sauce", "drink", "dessert"];

  const translations = {
    pizza: "Pizza",
    gyros: "Gyros",
    drink: "Ital",
    chicken: "Csirke",
    dessert: "Desszert",
    sauce: "Szósz"
  };


  return (
    <div className="category-div">
      {categories.map((cat) => (
        <button
          className="category-btn"
          key={cat}
          onClick={() => onSelectCategory(cat)}
          style={{
            padding: "10px 16px 7px",
            borderRadius: "5px",
            border: selectedCategory === cat ? "2px solid blue" : "1px solid gray",
            backgroundColor: selectedCategory === cat ? "lightblue" : "white",
            cursor: "pointer"
          }}
        >
          {translations[cat]}
        </button>
      ))}
    </div>
  );
}
