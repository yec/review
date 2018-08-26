import { combineReducers } from 'redux';
import fuelSavings from './fuelSavingsReducer';
import k8s from './k8sReducer';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  fuelSavings,
  k8s,
  routing: routerReducer
});

export default rootReducer;
