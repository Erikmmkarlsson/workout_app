import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { GetID } from '../auth'

export default function WorkoutList(props) {
  //States
  const [workoutList, setWorkoutList] = useState([])
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)

  //Set initial state
  useEffect(() => {
    const id = GetID();
    axios.get('/api/GetUser&UserManagerWorkouts/' + id).then((response) => {
      setWorkoutList(response.data.data)
    })
  }, [])

  //Set the selected workout as active
  function setActiveWorkout(workout, index) {
    setCurrentWorkout(workout)
    setCurrentIndex(index)
  }

  return (
    <div className='Workout'>
      <Link to='/'>
        <Button color="secondary">Go back</Button>
      </Link>
      <div><br></br></div>
      <div className="workoutBody">
        <div className='col-md-6'>
          <h4>Your workouts</h4>
          <ul className='list-group'>
            {workoutList &&
              workoutList.map((workout, index) => (
                <li
                  className={
                    'list-group-item ' + (index === currentIndex ? 'active' : '')
                  }
                  onClick={() => setActiveWorkout(workout, index)}
                  key={index}
                >
                  {workout.name}
                </li>
              ))}
          </ul>
        </div>
        <div className='col-md-6'>
          {currentWorkout
            ? (
              <div>
                <h4>Selected workout</h4>
                <div>
                  <label>
                    <strong>Name:</strong>
                  </label>{' '}
                  {currentWorkout.name}
                </div>
                <div>
                  <Link
                    to={'/workouts/edit?id=' + currentWorkout.id}
                    className='btn btn-warning'
                    style={{ marginTop: 25 }}
                  >
                    Edit workout
                  </Link>
                </div>
              </div>
            )
            : (
              <div>
                <br />
                <p>Please click on a Workout...</p>
              </div>
            )}
        </div>
      </div>
      <div>
        <Link
          to='/workouts/create'
          className='btn btn-success'
          style={{ marginTop: 25 }}
        >
          Create new workout
        </Link>
      </div>
    </div> // Test
  )
}
