import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddExercise from "./components/add-exercise.component";
import Exercise from "./components/exercise.component";
import ExerciseList from "./components/exercise-list.component";

class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/exercises" className="navbar-brand">
            Örebro Workouts
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/exercises"} className="nav-link">
                Exercises
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          
            <Switch>
              <Route exact path={["/", "/exercises"]} component={ExerciseList} />
              <Route exact path="/add" component={AddExercise} />
              <Route path="/tutorials/:id" component={Exercise} />
            </Switch>
        </div>
      </div>
    );
  }
}

export default App;