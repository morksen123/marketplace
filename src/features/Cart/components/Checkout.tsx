import { useCart } from '../hooks/useCart';

export const Checkout: React.FC = () => {
  const { cart, cartPrice, clearCart } = useCart();

  const handleCheckout = () => {
    // integrate with a payment gateway
    alert(`Checkout completed. Total: $${cartPrice.toFixed(2)}`);
    clearCart();
  };

  return (
    <div>
      <h2>Checkout</h2>
      {cart.map((item) => (
        <div key={item.id}>
          <span>
            {item.name} - ${item.price} x {item.quantity}
          </span>
        </div>
      ))}
      <div>Total: ${cartPrice.toFixed(2)}</div>
      <button onClick={handleCheckout}>Complete Purchase</button>
    </div>
  );
};
