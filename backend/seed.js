const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Food = require('./models/Food');

const sampleFoods = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    category: 'Main Course',
    image: 'https://via.placeholder.com/300?text=Margherita+Pizza',
    available: true,
    rating: 4.5
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan and creamy caesar dressing',
    price: 8.99,
    category: 'Appetizer',
    image: 'https://via.placeholder.com/300?text=Caesar+Salad',
    available: true,
    rating: 4.2
  },
  {
    name: 'Grilled Chicken Burger',
    description: 'Juicy grilled chicken breast with lettuce, tomato, and special sauce',
    price: 10.99,
    category: 'Main Course',
    image: 'https://via.placeholder.com/300?text=Chicken+Burger',
    available: true,
    rating: 4.6
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a flowing molten center, served with vanilla ice cream',
    price: 7.99,
    category: 'Dessert',
    image: 'https://via.placeholder.com/300?text=Chocolate+Lava+Cake',
    available: true,
    rating: 4.8
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice with no added sugar',
    price: 4.99,
    category: 'Beverage',
    image: 'https://via.placeholder.com/300?text=Orange+Juice',
    available: true,
    rating: 4.3
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 3.99,
    category: 'Sides',
    image: 'https://via.placeholder.com/300?text=Garlic+Bread',
    available: true,
    rating: 4.4
  },
  {
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
    price: 13.99,
    category: 'Main Course',
    image: 'https://via.placeholder.com/300?text=Spaghetti+Carbonara',
    available: true,
    rating: 4.7
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice and a splash of cream',
    price: 4.49,
    category: 'Beverage',
    image: 'https://via.placeholder.com/300?text=Iced+Coffee',
    available: true,
    rating: 4.5
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Crispy fried mozzarella served with marinara sauce',
    price: 6.99,
    category: 'Appetizer',
    image: 'https://via.placeholder.com/300?text=Mozzarella+Sticks',
    available: true,
    rating: 4.4
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of mascarpone and coffee',
    price: 6.99,
    category: 'Dessert',
    image: 'https://via.placeholder.com/300?text=Tiramisu',
    available: true,
    rating: 4.6
  },
  {
    name: 'Fish & Chips',
    description: 'Crispy battered fish with golden fries and tartar sauce',
    price: 14.99,
    category: 'Main Course',
    image: 'https://via.placeholder.com/300?text=Fish+and+Chips',
    available: true,
    rating: 4.5
  },
  {
    name: 'French Fries',
    description: 'Golden crispy fries with sea salt',
    price: 2.99,
    category: 'Sides',
    image: 'https://via.placeholder.com/300?text=French+Fries',
    available: true,
    rating: 4.3
  }
];

async function seedDatabase() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing foods
    await Food.deleteMany({});
    console.log('Cleared existing food items');

    // Insert sample foods
    const createdFoods = await Food.insertMany(sampleFoods);
    console.log(`✅ Successfully seeded ${createdFoods.length} food items!`);

    // Display created foods
    console.log('\nCreated foods:');
    createdFoods.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name} - $${food.price} (${food.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
