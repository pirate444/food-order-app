import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Menu from './components/Menu';
import ExternalFoodMenu from './components/ExternalFoodMenu';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import DebugCart from './pages/DebugCart';
import './styles/Navbar.css';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function HomePage() {
  const [useExternal, setUseExternal] = useState(false);

  return (
    <div>
      <div className="menu-toggle">
        <button 
          className={!useExternal ? 'active' : ''}
          onClick={() => setUseExternal(false)}
        >
          📦 Local Menu
        </button>
        <button 
          className={useExternal ? 'active' : ''}
          onClick={() => setUseExternal(true)}
        >
          🌍 World Cuisine
        </button>
      </div>
      {useExternal ? <ExternalFoodMenu /> : <Menu />}
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/debug-cart"
          element={
            <PrivateRoute>
              <DebugCart />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
