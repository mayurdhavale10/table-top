import { Flame, AlertTriangle, Leaf, Drumstick } from "lucide-react";
import { useCart } from "../../src/context/CartContext";
import "../styles/MenuCard.css";

function MenuCard({ item }) {
  const { addToCart } = useCart();
  
  return (
    <div className="menu-card">
      <div className="image-container">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="menu-content">
        <div className="menu-header">
          <h3>{item.name}</h3>
          <div className="rating">★ {item.rating || 4.5}</div>
        </div>

        <p className="description">{item.description}</p>

        <div className="card-info">
          {item.type && (
            <span className="pill-tag">
              {item.type === "Veg" ? <Leaf size={12} color="#16a34a" /> : <Drumstick size={12} color="#dc2626" />}
              {item.type}
            </span>
          )}
          {item.calories && (
            <span className="pill-tag">
              <Flame size={12} color="#f97316" /> {item.calories}
            </span>
          )}
          {item.allergens && item.allergens.length > 0 && item.allergens.map((allergen: string) => (
            <span key={allergen} className="pill-tag allergen">
              <AlertTriangle size={12} /> {allergen}
            </span>
          ))}
        </div>
        
        {(item.calories || (item.allergens && item.allergens.length > 0)) && (
          <span className="disclaimer">AI-estimated - Check with staff for severe allergies</span>
        )}

        <div className="bottom-section">
          <h4>₹{item.price}</h4>
          <button onClick={() => addToCart(item)}>
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;