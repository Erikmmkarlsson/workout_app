
import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import AppNavbar from './components/AppNavbar';
import RegisterUser from './components/RegisterUser'
import AddExercise from "./components/Exercises/add-exercise.component";
import Exercise from "./components/Exercises/exercise.component";
import ExerciseList from "./components/Exercises/exercise-list.component";
import Login from "./components/Login/login";



function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }


    return (
      <div className="App">
        <AppNavbar />
          <div className="container mt-3">
            <Switch>
              <Route exact path={["/register"]} component={RegisterUser} />
              
              <Route exact path={["/login"]} component={() => <Login setToken={setToken} />} />
              
              <Route exact path={["/exercises"]} component={ExerciseList} />
              <Route exact path="/add" component={AddExercise} />
              <Route exact path="/exercises/add" component={AddExercise} />

              <Route path="/exercises/:id" component={Exercise} />
              <Route path = '/' component={() => <Login setToken={setToken} />}/>

            </Switch>
          </div>
      </div>
    );
}


function ProtectedRoute() { 
  // This is a function that only lets logged in users access a specific url route
  // Use like <ProtectedRoute path="/exercises/:id" component={Exercise} />

    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          this.state.authenticated ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )

}


export default App;