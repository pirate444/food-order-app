# Backend README

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/food-order-app
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on port 5000.

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {...}
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "data": {...user_data}
}
```

### Food Endpoints

#### Get All Foods
```
GET /api/foods?category=Main%20Course
```

#### Create Food (Admin)
```
POST /api/foods
Content-Type: application/json

{
  "name": "Pizza",
  "description": "Delicious cheese pizza",
  "price": 12.99,
  "category": "Main Course",
  "image": "url_to_image"
}
```

### Cart Endpoints

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "foodId": "food_id",
  "quantity": 2
}
```

### Order Endpoints

#### Create Order
```
POST /api/orders
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "items": [
    {
      "food": "food_id",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "totalAmount": 25.98,
  "deliveryAddress": "123 Main St, City, State"
}
```

## Project Structure

- `/models` - Mongoose schemas
- `/controllers` - Route controllers (business logic)
- `/routes` - API routes
- `/middleware` - Custom middleware (auth, error handling)
- `/config` - Configuration files (database connection)
- `server.js` - Main server file

## Database

Uses MongoDB. Data is structured with the following collections:
- users
- foods
- orders
- carts

## Authentication

JWT (JSON Web Tokens) are used for authentication. Tokens are passed in the Authorization header as:
```
Authorization: Bearer <token>
```

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- dotenv: Environment variables
- cors: Cross-origin requests
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
