
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import AppNavbar from './components/AppNavbar';

import RegisterUser from './components/RegisterUser'
import AddExercise from "./components/Exercises/add-exercise.component";
import Exercise from "./components/Exercises/exercise.component";
import ExerciseList from "./components/Exercises/exercise-list.component";

import CreateWorkout from "./components/WorkoutCreation/createworkout";
import WorkoutList from "./components/WorkoutCreation/workoutlist";
import EditWorkout from "./components/WorkoutCreation/editworkout";

import AcceptUsers from "./components/ManagerPage/AcceptUsers"
import Login from "./components/Login/login";

import { useAuth } from "./components/auth";



function App() {

    return (
      <div className="App">
        <AppNavbar />
          <div className="container mt-3">
            <Switch>
              <PrivateRoute path="/MyUsers"> <AcceptUsers/> </PrivateRoute>
              <Route path="/register"> <RegisterUser/> </Route>
              <Route exact path="/login"> <Login/> </Route>
              
              <Route exact path="/exercises/"> <ExerciseList/> </Route>
              <Route exact path="/exercises/add"> <AddExercise/> </Route>
              <Route exact path="/exercises/:id" render={(props) => <Exercise {...props} />}/>

              <Route exact path="/workoutcreation/create"> <CreateWorkout/> </Route>
              <Route exact path="/workoutcreation/"> <WorkoutList/> </Route>
              <Route exact path="/workoutcreation/edit/:id" render={(props) => <EditWorkout {...props} />}/>

              <PrivateRoute path="/test" component={ExerciseList} />
              <Route path = '/'> <Login/> </Route>

            </Switch>
          </div>
      </div>
    );
}


//checks whether someone is logged in or not, if not then redirects to login page
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth();

  return <Route {...rest} render={(props) => (
    logged
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
}


export default App;