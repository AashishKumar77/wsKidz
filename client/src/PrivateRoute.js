import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// let user = localStorage.getItem("user") && localStorage.getItem("token")
export const PrivateRoute = ({ component: Component, ...rest }) => (
   <Route {...rest} render={props => (
      localStorage.getItem("token")
         ? <Component {...props} />
         : <Redirect to={{ pathname: "/", state: { from: props.location } }} />
   )} />
)

