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

const updatesReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_UPDATES':
      return action.payload;
    default:
      return state;
  }
};

const restaurantsReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_RESTAURANTS':
      return action.payload;
    default:
      return state;
  }
};

const laundryReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_LAUNDRY':
      return action.payload;
    default:
      return state;
  }
};

const servicesReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_SERVICES':
      return action.payload;
    default:
      return state;
  }
};

const busReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_BUSES':
      return action.payload;
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  menu: menuReducer,
  dishes: dishesReducer,
  updates: updatesReducer,
  restaurants: restaurantsReducer,
  laundry: laundryReducer,
  services: servicesReducer,
  buses: busReducer,
});

// Create Redux store
const store = createStore(rootReducer);

export default store;



