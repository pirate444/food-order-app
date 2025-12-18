import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService, orderService } from '../services/api';
import '../styles/Cart.css';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data.data);
    } catch (error) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (foodId, quantity) => {
    if (quantity < 1) {
      await handleRemoveItem(foodId);
      return;
    }

    try {
      const response = await cartService.updateCartItem(foodId, quantity);
      setCart(response.data.data);
    } catch (error) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (foodId) => {
    try {
      const response = await cartService.removeFromCart(foodId);
      setCart(response.data.data);
      setSuccess('Item removed from cart');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const response = await cartService.clearCart();
        setCart(response.data.data);
        setSuccess('Cart cleared');
        setTimeout(() => setSuccess(''), 2000);
      } catch (error) {
        setError('Failed to clear cart');
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      const totalAmount = cart.items.reduce((total, item) => {
        return total + (item.food.price * item.quantity);
      }, 0);

      const orderData = {
        items: cart.items.map(item => ({
          food: item.food._id,
          quantity: item.quantity,
          price: item.food.price
        })),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        deliveryAddress,
        notes
      };

      const response = await orderService.createOrder(orderData);
      setSuccess('✅ Order placed successfully!');
      setCart({ items: [] });
      setDeliveryAddress('');
      setNotes('');
      
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
      console.error('Error placing order:', error);
    }
  };

  if (loading) return <p className="loading">Loading cart...</p>;

  const totalAmount = cart?.items?.reduce((total, item) => {
    return total + (item.food.price * item.quantity);
  }, 0) || 0;

  return (
    <div className="cart-page-container">
      <h1>Shopping Cart</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      {!cart?.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')} className="continue-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <h2>Items in Cart</h2>
            <div className="cart-items-list">
              {cart.items.map(item => (
                <div key={item.food._id} className="cart-item-row">
                  <div className="item-info">
                    <h4>{item.food.name}</h4>
                    <p className="item-price">${item.food.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="quantity-control">
                    <button 
                      onClick={() => handleUpdateQuantity(item.food._id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.food._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => handleRemoveItem(item.food._id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleClearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-total">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Special Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or instructions?"
                />
              </div>

              <button type="submit" className="place-order-btn">
                Place Order - ${totalAmount.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
