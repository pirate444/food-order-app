const express = require('express');
const Food = require('../models/Food');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Test endpoint: Check auth status
router.get('/check-auth', auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth check passed',
    userId: req.userId
  });
});

// Test endpoint: Create food and add to cart
router.post('/add-external-meal', auth, async (req, res) => {
  try {
    console.log('\n=== TEST: Add External Meal to Cart ===');
    console.log('User ID:', req.userId);
    
    // Step 1: Create food
    console.log('\nStep 1: Creating food...');
    const foodData = {
      name: `Test External Meal ${Date.now()}`,
      description: 'Test meal from external API',
      price: 9.99,
      category: 'Main Course',
      image: 'https://via.placeholder.com/300',
      available: true,
      rating: 4.5
    };
    console.log('Food data:', foodData);
    
    const food = await Food.create(foodData);
    console.log('✓ Food created:', food._id);
    
    // Step 2: Add to cart
    console.log('\nStep 2: Adding to cart...');
    let cart = await Cart.findOne({ user: req.userId });
    console.log('Cart found:', cart ? 'Yes' : 'No');
    
    if (!cart) {
      console.log('Creating new cart...');
      cart = await Cart.create({
        user: req.userId,
        items: [{ food: food._id, quantity: 1 }]
      });
    } else {
      console.log('Adding to existing cart...');
      const itemIndex = cart.items.findIndex(
        item => item.food.toString() === food._id.toString()
      );
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ food: food._id, quantity: 1 });
      }
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.food');
    
    console.log('✓ Added to cart. Cart now has', cart.items.length, 'items');
    
    res.status(200).json({
      success: true,
      message: 'Test successful - external meal added to cart',
      data: {
        food: food,
        cart: cart
      }
    });
  } catch (error) {
    console.error('❌ Error in test:', error.message);
    console.error('Stack:', error.stack);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error
    });
  }
});

module.exports = router;
