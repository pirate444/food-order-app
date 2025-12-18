import React, { useState, useEffect } from 'react';
import { externalFoodService, foodService, cartService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Menu.css';

// Map external categories to our app's valid categories
const categoryMap = {
  'Seafood': 'Main Course',
  'Breakfast': 'Main Course',
  'Dessert': 'Dessert',
  'Vegetarian': 'Main Course',
  'Pasta': 'Main Course',
  'Side': 'Sides',
  'Beverage': 'Beverage',
  'Miscellaneous': 'Appetizer',
  'Vegan': 'Main Course',
  'Starter': 'Appetizer',
  'Chicken': 'Main Course'
};

const mapCategory = (externalCategory) => {
  return categoryMap[externalCategory] || 'Main Course';
};

function ExternalFoodMenu() {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Seafood');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchMealsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await externalFoodService.getCategories();
      if (response.data.categories) {
        setCategories(response.data.categories.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMealsByCategory = async (category) => {
    try {
      setLoading(true);
      setError('');
      const response = await externalFoodService.getMealsByCategory(category);
      
      if (response.data.meals) {
        const transformedMeals = response.data.meals.slice(0, 12).map(meal => ({
          _id: meal.idMeal,
          name: meal.strMeal,
          description: `Delicious ${category} dish`,
          price: (Math.random() * 15 + 5).toFixed(2),
          externalCategory: category,
          category: mapCategory(category),
          image: meal.strMealThumb,
          available: true,
          rating: (Math.random() * 2 + 3.5).toFixed(1)
        }));
        setMeals(transformedMeals);
      } else {
        setMeals([]);
        setError('No meals found in this category');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      setError('Failed to load meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      await fetchMealsByCategory(selectedCategory);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await externalFoodService.searchMeals(searchTerm);
      
      if (response.data.meals) {
        const transformedMeals = response.data.meals.slice(0, 12).map(meal => ({
          _id: meal.idMeal,
          name: meal.strMeal,
          description: `Delicious meal from ${meal.strArea || 'around the world'}`,
          price: (Math.random() * 15 + 5).toFixed(2),
          externalCategory: meal.strCategory || 'Miscellaneous',
          category: mapCategory(meal.strCategory || 'Miscellaneous'),
          image: meal.strMealThumb,
          available: true,
          rating: (Math.random() * 2 + 3.5).toFixed(1)
        }));
        setMeals(transformedMeals);
      } else {
        setMeals([]);
        setError('No meals found matching your search');
      }
    } catch (error) {
      console.error('Error searching meals:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-container">
      <h1>🍽️ Explore World Cuisine</h1>
      <p className="subtitle">Powered by TheMealDB - Thousands of recipes from around the world</p>
      
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat.idCategory}
            className={selectedCategory === cat.strCategory ? 'active' : ''}
            onClick={() => {
              setSelectedCategory(cat.strCategory);
              setSearchTerm('');
            }}
          >
            {cat.strCategory}
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p className="loading">Loading meals...</p>
      ) : meals.length === 0 ? (
        <p className="no-foods">No meals found. Try a different search or category.</p>
      ) : (
        <div className="food-grid">
          {meals.map(meal => (
            <ExternalFoodCard key={meal._id} food={meal} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExternalFoodCard({ food }) {
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
      setMessage('');
      
      console.log('=== External Food Add to Cart ===');
      console.log('Step 1: Starting add to cart for:', food.name);
      console.log('Food object:', food);
      console.log('Category:', food.externalCategory, '→', food.category);
      
      // Validate category enum
      const validCategories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Sides'];
      if (!validCategories.includes(food.category)) {
        throw new Error(`Invalid category: ${food.category}. Must be one of: ${validCategories.join(', ')}`);
      }
      
      // Step 1: Create the meal in database first
      console.log('Step 2: Creating food in database...');
      const foodPayload = {
        name: food.name,
        description: food.description,
        price: parseFloat(food.price),
        category: food.category,
        image: food.image,
        available: true,
        rating: parseFloat(food.rating)
      };
      console.log('Payload:', foodPayload);
      
      const createResponse = await foodService.createFood(foodPayload);
      console.log('Step 3: Food creation response:', createResponse);
      
      // Validate response structure
      if (!createResponse) {
        throw new Error('No response from food creation');
      }
      if (!createResponse.data) {
        throw new Error('No data in response: ' + JSON.stringify(createResponse));
      }
      if (!createResponse.data.data) {
        throw new Error('No nested data in response: ' + JSON.stringify(createResponse.data));
      }
      if (!createResponse.data.data._id) {
        throw new Error('No _id in food data: ' + JSON.stringify(createResponse.data.data));
      }
      
      const newMealId = createResponse.data.data._id;
      console.log('Step 4: Got food ID:', newMealId);
      console.log('Food data:', createResponse.data.data);
      
      // Step 2: Add to cart with the new meal ID
      console.log('Step 5: Adding to cart...');
      console.log('Food ID:', newMealId, 'Quantity: 1');
      const cartResponse = await cartService.addToCart(newMealId, 1);
      
      console.log('Step 6: Cart response:', cartResponse);
      console.log('Cart items:', cartResponse.data.data.items.length);
      
      setMessage('✅ Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('❌ ERROR in handleAddToCart:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error config:', error.config);
      
      let errorMsg = 'Failed to add to cart';
      if (error.response?.status === 401) {
        errorMsg = 'Session expired. Please login again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setMessage(`❌ ${errorMsg}`);
      setTimeout(() => setMessage(''), 4000);
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
      <div className="rating">⭐ {food.rating}</div>
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

export default ExternalFoodMenu;
