# Food Order App - MERN Stack

A full-stack food ordering application built with MongoDB, Express, React, and Node.js (MERN).

## Features

- **User Authentication**: Register and login with email/password
- **Food Menu**: Browse food items by category (Appetizer, Main Course, Dessert, Beverage, Sides)
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, view order history, track order status
- **User Profile**: Update personal information and delivery address
- **Admin Features**: Manage food items and order status (in controllers, ready to implement)

## Project Structure

```
fullstackproject/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── foodController.js  # Food CRUD
│   │   ├── cartController.js  # Cart management
│   │   └── orderController.js # Order logic
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── foods.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Menu.js
    │   │   └── CartSidebar.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── OrdersPage.js
    │   │   └── ProfilePage.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── services/
    │   │   └── api.js         # API service layer
    │   ├── styles/
    │   │   ├── Navbar.css
    │   │   ├── Menu.css
    │   │   ├── Cart.css
    │   │   ├── Auth.css
    │   │   ├── Orders.css
    │   │   └── Profile.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- **MongoDB**: See [MongoDB Setup Guide](./MONGODB_SETUP.md) for easy cloud setup with MongoDB Atlas

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. **Configure MongoDB** (see [MongoDB Setup Guide](./MONGODB_SETUP.md)):
   - **Easiest**: Use free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud service
   - Or install MongoDB locally / use Docker
   - Update `MONGODB_URI` in `.env` with your connection string

5. Start the backend server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

Frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Foods
- `GET /api/foods` - Get all foods (supports ?category filter)
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create food (admin)
- `PUT /api/foods/:id` - Update food (admin)
- `DELETE /api/foods/:id` - Delete food (admin)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `POST /api/cart/remove` - Remove item from cart (protected)
- `POST /api/cart/update` - Update item quantity (protected)
- `POST /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/orders/admin/all` - Get all orders (admin)

## Database Models

### User
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required),
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  createdAt: Date
}
```

### Food
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (Appetizer, Main Course, Dessert, Beverage, Sides),
  image: String,
  available: Boolean,
  rating: Number,
  createdAt: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    food: ObjectId (ref: Food),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (Pending, Processing, Ready, Delivered, Cancelled),
  deliveryAddress: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    food: ObjectId (ref: Food),
    quantity: Number
  }],
  updatedAt: Date
}
```

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Browse Menu**: View available food items, filter by category
3. **Add to Cart**: Click "Add to Cart" on food items
4. **View Orders**: Check order history and status in the Orders page
5. **Update Profile**: Update personal information in the Profile page

## Features to Add (Future Enhancement)

- Payment gateway integration (Stripe, PayPal)
- Email notifications for order updates
- Admin dashboard for managing foods and orders
- Reviews and ratings
- Search functionality
- Filters and sorting options
- Checkout page
- Order tracking with real-time updates
- Wishlist functionality

## Technologies Used

### Backend
- Node.js - Runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing

### Frontend
- React - UI library
- React Router - Navigation
- Axios - HTTP client
- Context API - State management
- CSS3 - Styling

## Running Tests

Currently no tests configured. Add Jest and Supertest for backend testing and Jest/React Testing Library for frontend testing.

## Deployment

### Backend (Heroku Example)
```bash
cd backend
heroku create app-name
git push heroku main
```

### Frontend (Vercel Example)
```bash
cd frontend
npm run build
vercel --prod
```

## Troubleshooting

**MongoDB connection error**: Ensure MongoDB is running and connection string is correct
**CORS error**: Check that backend CORS is configured to allow frontend URL
**Port already in use**: Change PORT in .env or kill process using the port

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
