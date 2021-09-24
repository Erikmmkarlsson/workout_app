
import React, { useState } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AppNavbar from './components/AppNavbar';
import RegisterUser from './components/RegisterUser'
import AddExercise from "./components/add-exercise.component";
import Exercise from "./components/exercise.component";
import ExerciseList from "./components/exercise-list.component";
import Login from "./components/Login/login"
import { render } from 'react-dom';



function ProtectedRoute() { 
  // This is a function that only lets logged in users access special resources
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



function App() {
  const [token, setToken] = useState();

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

export default App;