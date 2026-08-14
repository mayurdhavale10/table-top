import { MapPin, Star } from "lucide-react";
import "../styles/RestaurantHeader.css";

interface RestaurantHeaderProps {
  name?: string;
  location?: string;
}

function RestaurantHeader({ name = "Sips & Bites", location = "KHADAKPADA, KALYAN WEST" }: RestaurantHeaderProps) {
  return (
    <div className="restaurant-header">
      <div className="header-overlay"></div>
      <div className="restaurant-details">
        <p><MapPin size={14} className="icon" /> {location}</p>
        <h1>{name}</h1>
        <div className="restaurant-rating">
          <Star size={16} fill="#F59E0B" color="#F59E0B" className="icon" /> 4.8 <span>(500+ Reviews)</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantHeader;