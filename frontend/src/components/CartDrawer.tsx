import "../styles/CartDrawer.css";
import BannerAd from "./BannerAd";

function CartDrawer({
  cart,
  isOpen,
  setIsOpen,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setShowOrderForm,
}) {
  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>🛒 Your Cart</h2>

        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="cart-items">        
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <h4>{item.name}</h4>

                <p>Price : ₹{item.price}</p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "10px 0",
                  }}
                >
                  <button onClick={() => decreaseQuantity(item.id)}>
                    −
                  </button>

                  <strong>{item.quantity}</strong>

                  <button onClick={() => increaseQuantity(item.id)}>
                    +
                  </button>
                </div>

                <h4>
                  Total : ₹{item.price * item.quantity}
                </h4>
              </div>
            ))}

            <hr />

            <h3>
              Grand Total : ₹
              {cart.reduce(
                (total, item) =>
                  total + item.price * item.quantity,
                0
              )}
            </h3>

            <button
              onClick={clearCart}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "20px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              🗑 Empty Cart
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setShowOrderForm(true);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              🛒 Place Order
            </button>
            
            <BannerAd />
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;