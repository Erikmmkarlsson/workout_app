
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './App.css'

import { Navbar, AppNavbar } from './components/navbar/'
import { Hero } from './components/Landing Page/'
import { Login } from './components/Login'

import ManagerDashboard from './components/ManagerDashboard/managerdashboard'
import UserDashboard from './components/UserDashboard/userdashboard'
import { AddExercise, EditExercise, ExerciseList } from './components/Exercises'
import { CreateWorkout, WorkoutList, EditWorkout } from './components/Workouts/'
import { EditTrainingPlan } from './components/TrainingPlans'
import AcceptUsers from './components/ManagerPage/AcceptUsers'
import { EditProfile, PasswordReset, Profile } from './components/Profile'
import { useAuth, GetRole } from './components/auth'
import FindFriend from './components/Friend/FindFriend.jsx'

function App() {
  const [loggedIn] = useAuth()
  const role = GetRole()

  if (loggedIn && role === 'manager') {
    return (
      <div className='App'>
        <AppNavbar />
        <div>
          <Switch>
            <PrivateRoute path='/MyUsers'> <AcceptUsers /> </PrivateRoute>
            <Route exact path='/login'> <Login /> </Route>

            <Route exact path='/managerdashboard/'> <ManagerDashboard /> </Route>

            <Route exact path='/exercises/'> <ExerciseList /> </Route>
            <Route exact path='/exercises/add'> <AddExercise /> </Route>
            <Route exact path='/exercises/edit'> <EditExercise /> </Route>

            <Route exact path='/workouts/'> <WorkoutList /> </Route>
            <Route exact path='/workouts/create'> <CreateWorkout /> </Route>
            <Route exact path='/workouts/edit'> <EditWorkout /> </Route>

            <Route path='/trainingplans'> <EditTrainingPlan /> </Route>

            <Route path='/editprofile'> <EditProfile /> </Route>
            <Route path='/passwordreset'> <PasswordReset /> </Route>
            <Route exact path='/profile/:id' render={(props) => <Profile {...props} />} />
            <Route path='/profile'> <Profile /> </Route>

            <Route path='/findfriend'> <FindFriend/> </Route>

            <Route exactpath='/'>  <ManagerDashboard /></Route>

          </Switch>
        </div>
      </div>
    )
  } else if (loggedIn) { // regular user
    return (
      <div className='App'>
        <AppNavbar />
        <Switch>
        

          <Route path='/editprofile'> <EditProfile /> </Route>
          <Route path='/passwordreset'> <PasswordReset /> </Route>
          <Route exact path='/profile/:id' render={(props) => <Profile {...props} />} />
          <Route path='/profile'> <Profile /> </Route>
          <Route exact path='/login'> <Login /> </Route>

          <Route exactpath='/'>  <UserDashboard /></Route>

        </Switch>
      </div>
    )
  } else { // not logged in
    return (
      <div>
        <Navbar />
        <div>
          <Switch>

            <Route path='/register'> <Login /> </Route>
            <Route path='/login'> <Login /> </Route>
            <Route path='/'>  <Hero /> </Route>

          </Switch>

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
