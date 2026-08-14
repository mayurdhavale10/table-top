import "../styles/OrderForm.css";

function OrderForm({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div className="order-overlay">
      <div className="order-form">
        <h2>Confirm Your Order</h2>

        <input
          type="text"
          placeholder="Your Name"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
        />

        <input
          type="text"
          placeholder="Table Number (Optional)"
        />

        <textarea
          placeholder="Special Instructions (Optional)"
          rows={4}
        />

        <button className="confirm-btn">
          Confirm Order
        </button>

        <button
          className="cancel-btn"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default OrderForm;