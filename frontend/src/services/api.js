import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const MEAL_DB_API = 'https://www.themealdb.com/api/json/v1/1';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (username, email, password, firstName, lastName) =>
    api.post('/auth/register', { username, email, password, firstName, lastName }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Food Service - Using Local MongoDB
export const foodService = {
  getAllFoods: (category) =>
    api.get('/foods', { params: { category } }),
  getFoodById: (id) => api.get(`/foods/${id}`),
  createFood: (data) => api.post('/foods', data),
  updateFood: (id, data) => api.put(`/foods/${id}`, data),
  deleteFood: (id) => api.delete(`/foods/${id}`)
};

// External Food API Service - TheMealDB (FREE - No API Key Required)
export const externalFoodService = {
  // Search meals by name
  searchMeals: (searchTerm) =>
    axios.get(`${MEAL_DB_API}/search.php?s=${searchTerm}`),
  
  // Get meals by category
  getMealsByCategory: (category) =>
    axios.get(`${MEAL_DB_API}/filter.php?c=${category}`),
  
  // Get all categories
  getCategories: () =>
    axios.get(`${MEAL_DB_API}/categories.php`),
  
  // Get meal by ID
  getMealById: (id) =>
    axios.get(`${MEAL_DB_API}/lookup.php?i=${id}`),
  
  // Get random meal
  getRandomMeal: () =>
    axios.get(`${MEAL_DB_API}/random.php`),
  
  // Get meals by ingredient
  getMealsByIngredient: (ingredient) =>
    axios.get(`${MEAL_DB_API}/filter.php?i=${ingredient}`)
};

// Cart Service
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (foodId, quantity) =>
    api.post('/cart/add', { foodId, quantity }),
  removeFromCart: (foodId) =>
    api.post('/cart/remove', { foodId }),
  clearCart: () => api.post('/cart/clear'),
  updateCartItem: (foodId, quantity) =>
    api.post('/cart/update', { foodId, quantity })
};

// Order Service
export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}`, { status }),
  getAllOrders: () => api.get('/orders/admin/all')
};

export default api;
