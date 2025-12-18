import React, { useState } from 'react';
import { foodService, cartService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function DebugCart() {
  const { isAuthenticated, user, token } = useAuth();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const testAddToCart = async () => {
    try {
      setLoading(true);
      setOutput('Starting comprehensive cart debug test...\n');

      // Check auth state from context
      setOutput(prev => prev + `\n1. Auth Context Check:\n`);
      setOutput(prev => prev + `   isAuthenticated: ${isAuthenticated}\n`);
      setOutput(prev => prev + `   user: ${user ? user.email : 'null'}\n`);
      setOutput(prev => prev + `   token present: ${token ? 'YES' : 'NO'}\n`);

      // Check localStorage
      const localToken = localStorage.getItem('token');
      setOutput(prev => prev + `\n2. LocalStorage Check:\n`);
      setOutput(prev => prev + `   token in localStorage: ${localToken ? 'YES' : 'NO'}\n`);

      if (!isAuthenticated || !token) {
        setOutput(prev => prev + `\n❌ NOT AUTHENTICATED - Please login first!\n`);
        setLoading(false);
        return;
      }

      // Get token from localStorage
      const authToken = localStorage.getItem('token');
      setOutput(prev => prev + `\n3. Token Check:\n`);
      setOutput(prev => prev + `   Token length: ${authToken?.length || 0}\n`);
      setOutput(prev => prev + `   Token preview: ${authToken ? authToken.substring(0, 20) + '...' : 'N/A'}\n`);

      // Test auth endpoint first
      setOutput(prev => prev + `\n4. Testing Auth Endpoint:\n`);
      try {
        const authCheckResponse = await cartService.getCart();
        setOutput(prev => prev + `   ✓ Cart endpoint accessible (Auth working)\n`);
        setOutput(prev => prev + `   Current cart items: ${authCheckResponse.data.data.items.length}\n`);
      } catch (authError) {
        setOutput(prev => prev + `   ✗ Auth failed: ${authError.response?.data?.message || authError.message}\n`);
        throw authError;
      }

      // Test creating a food item
      setOutput(prev => prev + `\n5. Creating Test Food:\n`);
      const foodResponse = await foodService.createFood({
        name: `Test Meal ${Date.now()}`,
        description: 'Test meal for debugging',
        price: 9.99,
        category: 'Main Course',
        image: 'https://via.placeholder.com/300',
        available: true,
        rating: 4.5
      });

      const foodData = foodResponse.data.data;
      const foodId = foodData._id;
      setOutput(prev => prev + `   ✓ Food created\n`);
      setOutput(prev => prev + `   Food ID: ${foodId}\n`);
      setOutput(prev => prev + `   Food name: ${foodData.name}\n`);

      // Test adding to cart
      setOutput(prev => prev + `\n6. Adding to Cart:\n`);
      const cartResponse = await cartService.addToCart(foodId, 1);
      
      setOutput(prev => prev + `   ✓ Successfully added to cart\n`);
      setOutput(prev => prev + `   Cart now has: ${cartResponse.data.data.items.length} items\n`);

      // Get final cart state
      setOutput(prev => prev + `\n7. Final Cart State:\n`);
      const finalCart = await cartService.getCart();
      const items = finalCart.data.data.items;
      setOutput(prev => prev + `   Total items: ${items.length}\n`);
      items.forEach((item, idx) => {
        setOutput(prevOutput => prevOutput + `   ${idx + 1}. ${item.food.name} x${item.quantity} ($${item.food.price})\n`);
      });

      setOutput(prev => prev + '\n✅ ALL TESTS PASSED! Cart is working correctly.');
    } catch (error) {
      console.error('Full error object:', error);
      const errorMsg = error.response?.data?.message || error.message;
      const errorStatus = error.response?.status;
      
      setOutput(prev => prev + `\n❌ ERROR (Status ${errorStatus}): ${errorMsg}\n`);
      
      if (error.response?.data) {
        setOutput(prev => prev + `\nError details: ${JSON.stringify(error.response.data, null, 2)}\n`);
      }
      
      if (error.config) {
        setOutput(prev => prev + `\nRequest: ${error.config.method?.toUpperCase()} ${error.config.url}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>🔧 Cart Functionality Debugger</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This tool will test the complete cart workflow. Make sure you're logged in first!
      </p>
      <div style={{ 
        background: isAuthenticated ? '#d4edda' : '#f8d7da', 
        padding: '10px', 
        borderRadius: '4px',
        marginBottom: '20px',
        color: isAuthenticated ? '#155724' : '#721c24'
      }}>
        {isAuthenticated ? `✓ Logged in as ${user?.email}` : '✗ Not logged in'}
      </div>
      <button 
        onClick={testAddToCart} 
        disabled={loading || !isAuthenticated}
        style={{
          padding: '12px 24px',
          background: isAuthenticated ? '#3498db' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAuthenticated && !loading ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          opacity: isAuthenticated ? 1 : 0.6
        }}
      >
        {loading ? '⏳ Running Tests...' : '▶ Run Debug Test'}
      </button>
      <pre style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '4px',
        overflowX: 'auto',
        minHeight: '400px',
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        border: '1px solid #ddd'
      }}>
        {output || 'Output will appear here...'}
      </pre>
    </div>
  );
}

export default DebugCart;
