
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AppNavbar from './components/AppNavbar';
import RegisterUser from './components/RegisterUser'
import AddExercise from "./components/add-exercise.component";
import Exercise from "./components/exercise.component";
import ExerciseList from "./components/exercise-list.component";

class App extends Component{
  render(){
    return (
      <div className="App">
        <AppNavbar />
          <div className="container mt-3">
            <Switch>
              <Route exact path={["/register"]} component={RegisterUser} />
              <Route exact path={["/", "/exercises"]} component={ExerciseList} />
              <Route exact path="/exercises/add" component={AddExercise} />
              <Route path="/exercises/:id" component={Exercise} />
            </Switch>
          </div>
      </div>
    );
  }
}

export default App;