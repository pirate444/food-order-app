import React, { useState, useEffect } from 'react';
import { foodService, cartService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Menu.css';

function FoodMenu() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodService.getAllFoods(selectedCategory);
      setFoods(response.data.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Sides'];

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      
      <div className="category-filter">
        <button
          className={!selectedCategory ? 'active' : ''}
          onClick={() => setSelectedCategory('')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={selectedCategory === cat ? 'active' : ''}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : foods.length === 0 ? (
        <p className="no-foods">No items found in this category</p>
      ) : (
        <div className="food-grid">
          {foods.map(food => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

function FoodCard({ food }) {
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setMessage('Please login to add items to cart');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart(food._id, 1);
      setMessage('✅ Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Failed to add to cart');
      console.error('Error adding to cart:', error);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="food-card">
      <img src={food.image} alt={food.name} />
      <h3>{food.name}</h3>
      <p className="description">{food.description}</p>
      <p className="category">{food.category}</p>
      <div className="card-footer">
        <span className="price">${food.price}</span>
        <button 
          onClick={handleAddToCart} 
          className="add-btn"
          disabled={addingToCart}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default FoodMenu;
