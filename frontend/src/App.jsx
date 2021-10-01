
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import AppNavbar from './components/navbar/AppNavbar'
import Navbar from './components/navbar/Navbar'
import { Hero } from './components/Landing Page/'
import Login from './components/Login/login'
import RegisterUser from './components/Login/RegisterUser'

import ManagerDashboard from './components/Dashboard/managerdashboard'

import AddExercise from './components/Exercises/createexercise'
import EditExercise from './components/Exercises/editexercise'
import ExerciseList from './components/Exercises/exerciselist'

import CreateWorkout from './components/WorkoutCreation/createworkout'
import WorkoutList from './components/WorkoutCreation/workoutlist'
import EditWorkout from './components/WorkoutCreation/editworkout'

import AcceptUsers from './components/ManagerPage/AcceptUsers'

import Profile from './components/Profile/profile.component'
import Password from './components/Profile/password.component'
import ViewProfile from './components/Profile/viewprofile.component'

import { useAuth } from './components/auth'

function App () {
  const [loggedIn] = useAuth()

  if (loggedIn) {
    return (
      <div className='App'>
        <AppNavbar />
        <div className='container mt-3'>
          <Switch>
            <PrivateRoute path='/MyUsers'> <AcceptUsers /> </PrivateRoute>
            <Route path='/register'> <RegisterUser /> </Route>
            <Route exact path='/login'> <Login /> </Route>

            <Route exact path='/managerdashboard/'> <ManagerDashboard /> </Route>

            <Route exact path='/exercises/'> <ExerciseList /> </Route>
            <Route exact path='/exercises/add'> <AddExercise /> </Route>
            <Route exact path='/exercises/edit'> <EditExercise /> </Route>

            <Route exact path='/workoutcreation/create'> <CreateWorkout /> </Route>
            <Route exact path='/workoutcreation/'> <WorkoutList /> </Route>
            <Route exact path='/workoutcreation/edit'> <EditWorkout /> </Route>

            <Route exact path='/profile/:id' render={(props) => <Profile {...props} />} />
            <Route exact path='/EditPassword/:id' render={(props) => <Password {...props} />} />
            <Route exact path='/ViewProfile/:id' render={(props) => <ViewProfile {...props} />} />

            <PrivateRoute path='/test' component={ExerciseList} />
            <Route exactpath='/'>  <ManagerDashboard /> </Route>

          </Switch>
        </div>
      </div>
    )
  } else { // not logged in
    return (
      <div>
        <Navbar />
        <div>

          <Route exact path='/login'> <Login /> </Route>
          <Route exact path='/'>  <Hero /> </Route>

        </div>
      </div>
    )
  }
}

// checks whether someone is logged in or not, if not then redirects to login page
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth()

  return (
    <Route
      {...rest} render={(props) => (
        logged
          ? <Component {...props} />
          : <Redirect to='/login' />
      )}
    />
  )
}

export default App
