import { createStore, combineReducers } from 'redux';

// Define reducers
const menuReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_MENU':
      return action.payload;
    default:
      return state;
  }
};

const dishesReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_DISHES':
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  menu: menuReducer,
  dishes: dishesReducer,
});

// Create Redux store
const store = createStore(rootReducer);

export default store;



