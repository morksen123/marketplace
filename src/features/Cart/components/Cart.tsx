import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartPrice } = useCart();

  return (
    <div>
      <h2>Cart</h2>
      {cart.map((item) => (
        <div key={item.id}>
          <span>
            {item.name} - ${item.price} x {item.quantity}
          </span>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <Link to="/buyer/checkout">Checkout</Link>
      <div>Total: ${cartPrice.toFixed(2)}</div>
    </div>
  );
};
