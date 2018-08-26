import {
  GET_NAMESPACE_REQUEST,
  GET_NAMESPACE_SUCCESS,
  CREATE_INGRESS_SUCCESS,
  GET_INGRESSES_SUCCESS,
} from '../constants/actionTypes';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function k8sReducer(state = { requesting: false, ingresses: { items : [] } }, action) {
  let newState;

  switch (action.type) {
    case GET_NAMESPACE_REQUEST:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      return {...state, requesting: true };
    case GET_NAMESPACE_SUCCESS:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      console.log(action);
      return {...state, requesting: false, namespaces: action.result };
    case CREATE_INGRESS_SUCCESS:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      console.log(action);
      return state;
    case GET_INGRESSES_SUCCESS:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      console.log(action);
      return {...state, ingresses: action.result};
    default:
      return state;
  }
}
