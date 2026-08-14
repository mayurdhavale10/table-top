import "../styles/CartButton.css";

function CartButton({ cart, onClick }) {
  return (
    <button className="cart-button" onClick={onClick}>
      🛒 Cart ({cart.length})
    </button>
  );
}

export default CartButton;