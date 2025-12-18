# External Food API Integration

## Overview

Your app now supports TWO food sources:

1. **📦 Local Menu** - Food items stored in your MongoDB database (12 seeded items)
2. **🌍 World Cuisine** - Real meal data from **TheMealDB API** (free, 1000s of meals)

Users can toggle between both options on the home page!

## Features

### Local Menu
- Food items stored in MongoDB
- Category filtering (Appetizer, Main Course, Dessert, Beverage, Sides)
- Customizable pricing and descriptions
- Full admin control

### World Cuisine (External API)
- Powered by [TheMealDB](https://www.themealdb.com/)
- Search functionality - find any meal by name
- 13+ meal categories (Seafood, Breakfast, Dessert, etc.)
- Real meal names and authentic images
- **100% FREE - No API key required!**
- Access to 1000s of recipes from around the world

## How It Works

### TheMealDB API Integration

The external API provides:
- ✅ Meal search by name
- ✅ Filter meals by category
- ✅ Get all available categories
- ✅ Authentic meal images from Wikimedia
- ✅ Meal descriptions and origins

### Pricing
Since TheMealDB doesn't provide pricing, the app generates:
- Random prices between $5-$20
- Random ratings between 3.5-5.5 stars
- All meals categorized appropriately

## Usage

1. **Visit Home Page** - See toggle buttons for both menu sources
2. **Click "📦 Local Menu"** - Browse your seeded items (12 meals)
3. **Click "🌍 World Cuisine"** - Browse TheMealDB meals
4. **Search Meals** - Type in the search box to find specific meals
5. **Filter by Category** - Select from available categories
6. **Add to Cart** - Same checkout process for both sources

## API Endpoints Used

### TheMealDB (Public, No Key Required)
```
GET /api/json/v1/1/search.php?s={meal_name}
GET /api/json/v1/1/filter.php?c={category}
GET /api/json/v1/1/categories.php
GET /api/json/v1/1/lookup.php?i={meal_id}
GET /api/json/v1/1/random.php
GET /api/json/v1/1/filter.php?i={ingredient}
```

### Your Backend API (with Authentication)
```
POST /api/cart/add          - Add meal to cart
GET /api/cart              - Get user's cart
POST /api/orders           - Place order
GET /api/orders            - Get user's orders
```

## File Changes

### New Files
- `/frontend/src/components/ExternalFoodMenu.js` - External food menu component

### Updated Files
- `/frontend/src/services/api.js` - Added `externalFoodService` with TheMealDB endpoints
- `/frontend/src/App.js` - Added menu toggle logic
- `/frontend/src/styles/Menu.css` - Added styles for toggle and search bar

## Advanced Usage

### Add More Features

**1. Save External Meals to Database**
```javascript
// When user adds TheMealDB meal to cart, save it first
const response = await foodService.createFood({
  name: meal.strMeal,
  description: meal.strMeal,
  price: meal.price,
  category: meal.strCategory,
  image: meal.strMealThumb,
  available: true,
  rating: 4.5
});
```

**2. Use Different External APIs**

- **Spoonacular API** (Better pricing data, but requires API key - free tier available)
- **Edamam Recipe API** (Nutrition data included)
- **RecipePuppy API** (Completely free, no key needed)

**3. Add Meal Details Modal**
```javascript
// Show full recipe when user clicks meal
const getMealDetails = async (mealId) => {
  const response = await externalFoodService.getMealById(mealId);
  // Display ingredients, instructions, cooking time, etc.
};
```

## Switching API Providers

To use a different API, update `/frontend/src/services/api.js`:

```javascript
const DIFFERENT_API = 'https://api.example.com';

export const externalFoodService = {
  getAllMeals: () => axios.get(`${DIFFERENT_API}/meals`),
  // ... add other methods
};
```

Then create a new component similar to `ExternalFoodMenu.js`.

## Troubleshooting

**"No meals found"**
- TheMealDB API might be temporarily unavailable
- Try searching with common terms: "pizza", "pasta", "salad", "chicken"

**"Failed to load categories"**
- Check your internet connection
- TheMealDB is usually very reliable

**Images not loading**
- Images are hosted on Wikimedia Commons
- Check if Wikimedia is accessible in your region

## Performance Tips

- Categories and search results are cached in component state
- API calls are debounced to avoid excessive requests
- Meals are limited to 12 per page to avoid overwhelming the UI

## Next Steps

1. ✅ Frontend can switch between local and external APIs
2. 🔄 Consider saving popular external meals to your database
3. 📱 Add filtering by price and ratings
4. ⭐ Add user review system for both local and external meals
5. 💬 Add comments/notes when saving external meals to local DB
