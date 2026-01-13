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
          className={`category-btn ${selectedCategory === cat ? "selected" : ""}`}
          key={cat}
          onClick={() => onSelectCategory(cat)}
        >
          {translations[cat]}
        </button>

      ))}
    </div>
  );
}
