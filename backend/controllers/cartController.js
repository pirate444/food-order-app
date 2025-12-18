const Cart = require('../models/Cart');

// Get cart for user
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId })
      .populate('items.food');

    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    
    console.log('Add to cart request - userId:', req.userId, 'foodId:', foodId, 'quantity:', quantity);

    if (!foodId || !quantity || quantity < 1) {
      console.log('Invalid request parameters');
      return res.status(400).json({
        success: false,
        message: 'Please provide valid food ID and quantity'
      });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [{ food: foodId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.food.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ food: foodId, quantity });
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.body;

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.food.toString() !== foodId
    );

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId },
      { items: [], updatedAt: Date.now() },
      { new: true }
    ).populate('items.food');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid food ID and quantity'
      });
    }

    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.food.toString() === foodId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.food');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
