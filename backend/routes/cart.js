const express = require('express');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItem
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.post('/remove', auth, removeFromCart);
router.post('/clear', auth, clearCart);
router.post('/update', auth, updateCartItem);

module.exports = router;
