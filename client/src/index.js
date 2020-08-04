import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import jwtDecode from 'jwt-decode'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer'
import { auth } from './helpers/auth';
import { setCurrentUser } from './actions/Login/otpAction'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

if (localStorage.getItem('token')) {
  auth(localStorage.getItem('token'))
  store.dispatch(setCurrentUser(jwtDecode(localStorage.getItem('token'))))
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
