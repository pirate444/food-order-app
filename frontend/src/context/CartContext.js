import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalAmount: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return {
        items: action.payload.items || [],
        totalAmount: calculateTotal(action.payload.items)
      };
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.payload],
        totalAmount: state.totalAmount + action.payload.price * action.payload.quantity
      };
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.id !== action.payload.id),
        totalAmount: calculateTotal(
          state.items.filter(item => item.id !== action.payload.id)
        )
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const setCart = (items) => {
    dispatch({ type: 'SET_CART', payload: { items } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, setCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
