# Frontend README

## Getting Started

### Installation

```bash
npm install
```

### Running the App

Development mode:
```bash
npm start
```

Build for production:
```bash
npm run build
```

The app will open at `http://localhost:3000`

## Features

### Components

- **Navbar** - Navigation bar with links and logout button
- **Menu** - Display food items with category filters
- **CartSidebar** - Show cart items and total

### Pages

- **LoginPage** - User login form
- **RegisterPage** - User registration form
- **OrdersPage** - View user's order history
- **ProfilePage** - Edit user profile information

### Context & State Management

- **AuthContext** - Manages user authentication state
- **CartContext** - Manages shopping cart state

### Services

- **api.js** - Centralized API service with axios interceptors

## Project Structure

```
src/
├── components/     - Reusable React components
├── pages/          - Page components for routes
├── context/        - Context API providers
├── services/       - API service layer
├── styles/         - CSS stylesheets
├── App.js          - Main App component with routes
└── index.js        - React DOM render
```

## Environment Setup

If needed, create a `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token added to all API requests in axios interceptor
5. PrivateRoute component checks authentication for protected pages

## API Integration

All API calls go through the `api.js` service. Example:

```javascript
import { foodService } from '../services/api';

const foods = await foodService.getAllFoods(category);
```

## Styling

CSS files organized by component/page in the `styles/` folder.

## Dependencies

- react: UI library
- react-dom: React rendering
- react-router-dom: Navigation
- axios: HTTP client

## Available Routes

- `/` - Home/Menu page (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/orders` - User orders (protected)
- `/profile` - User profile (protected)

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Troubleshooting

- **API not connecting**: Ensure backend is running on port 5000
- **CORS errors**: Check backend CORS configuration
- **Token not persisting**: Check localStorage in browser DevTools
