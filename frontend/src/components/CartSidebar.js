import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

function CartSidebar() {
  const { items, totalAmount } = useCart();

  return (
    <div className="cart-sidebar">
      <h2>Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: ${totalAmount.toFixed(2)}</strong>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}

export default CartSidebar;
