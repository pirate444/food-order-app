const Food = require('../models/Food');

// Get all foods
exports.getAllFoods = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const foods = await Food.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: foods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single food
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create food (Admin only)
exports.createFood = async (req, res) => {
  try {
    console.log('Creating food with data:', req.body);
    const food = await Food.create(req.body);
    console.log('Food created successfully:', food);
    res.status(201).json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Error creating food:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update food (Admin only)
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete food (Admin only)
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
