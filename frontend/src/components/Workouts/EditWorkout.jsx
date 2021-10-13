import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function EditWorkout(props) {
  //States
  const [workout_id, setWorkoutId] = useState(null)
  const [exercisesList, setExerciseslist] = useState([])
  const [selectedExercisesList, setSelectedExerciseslist] = useState([])
  const [hasUpdated, setUpdated] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [searchName, setSearchName] = useState("")
  const [currentWorkoutExercise, setCurrentWorkoutExercise] = useState({
    workout_id: null,
    exercise_id: null,
    num_sets: null,
    num_reps: null,
    num_seconds: null,
    comment: ''
  })

  //Set intial states
  useEffect(() => {
    setWorkoutId(
      parseInt(new URLSearchParams(window.location.search).get('id'), 10)
    )
    axios.get('/api/exercises').then((response) => {
      setExerciseslist(response.data.data)
    })
    axios
      .get(
        '/api/workout_exercises?workout_id=' +
        parseInt(new URLSearchParams(window.location.search).get("id"), 10)
      )
      .then((response) => {
        setSelectedExerciseslist(response.data.data)
      })
  }, [hasUpdated])

  //Functions
  const handleChange = (name) => (e) => {
    //Handles when a user makes changes to a workout, updates the variable
    setCurrentWorkoutExercise({
      ...currentWorkoutExercise,
      [name]: e.target.value
    })
  }

  const handleSearchChange = () => (e) => {
    //Handles changes to the search field
    setSearchName(e.target.value)
  }

  function setActiveExercise(exercise, index) {
    //Set the selected exercise as active, updates variable
    setCurrentExercise(exercise)
    setCurrentIndex(index)
    setCurrentWorkoutExercise({
      ...currentWorkoutExercise,
      workout_id: workout_id,
      exercise_id: exercise.id
    })
  }

  function search() {
    //Handles when a user searches, fetches the database entries that match
    axios.get("/api/exercises?search=" + searchName).then((response) => {
      setExerciseslist(response.data.data)
    })
  }

  function removeExercise(id) {
    //Handles when a user deletes an exercise, removes it from the database
    axios.delete("http://localhost:8000/api/workout_exercises/" + id)
    axios
      .get(
        "http://localhost:8000/api/workout_exercises?workout_id=" + workout_id
      )
      .then(() => {
        setUpdated(!hasUpdated)
      })
  }

  function saveWorkoutExercise() {
    //Handles when the user finishes adding the exercise to the workout
    axios({
      method: "post",
      url: "http://localhost:8000/api/workout_exercises",
      data: currentWorkoutExercise
    })
    axios
      .get(
        "http://localhost:8000/api/workout_exercises?workout_id=" +
        parseInt(workout_id, 10)
      )
      .then(() => {
        setUpdated(!hasUpdated)
      })
  }

  return (
    <div className='Workout'>
      <Link to='/workouts'>
        <button className='m-3 btn-sm btn-warning'>
          Return to your workouts
        </button>
      </Link>
      <div className='col-md-8'>
        <div className='input-group mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder='Search by exercise name'
            value={searchName}
            onChange={handleSearchChange("searchName")}
          />
          <div className='input-group-append'>
            <button
              className='btn btn-outline-secondary'
              type='button'
              onClick={search}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className='col-md-6'>
        <h4>Add exercises to workout {workout_id}</h4>
        <ul className='list-group'>
          {exercisesList &&
            exercisesList.map((exercise, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveExercise(exercise, index)}
                key={index}
              >
                {exercise.name}
              </li>
            ))}
        </ul>
        <Link
          to='/exercises/add'
          className='btn btn-success'
          style={{ marginTop: 25 }}
        >
          Add new
        </Link>
      </div>
      <div className='col-md-6'>
        {currentExercise ? (
          <div>
            <h4>Exercise</h4>
            <div>
              <label>
                <strong>Name:</strong>
              </label>{" "}
              {currentExercise.name}
            </div>
            <div>
              <label>
                <strong>Description:</strong>
              </label>{" "}
              {currentExercise.description}
            </div>
            <div>
              <label>
                <strong>Updated:</strong>
              </label>{" "}
              {currentExercise.last_updated} GMT
            </div>
            <div className='form-group'>
              <label htmlFor='num_sets'>Number of sets</label>
              <input
                type='number'
                className='form-control'
                id='num_sets'
                value={currentWorkoutExercise.num_sets}
                onChange={handleChange("num_sets")}
                name='num_sets'
                placeholder='Enter number of sets for this exercise'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='num_reps'>Number of reps</label>
              <input
                type='number'
                className='form-control'
                id='num_reps'
                value={currentWorkoutExercise.num_reps}
                onChange={handleChange("num_reps")}
                name='num_reps'
                placeholder='Enter number of reps for this exercise'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='num_seconds'>Number of seconds</label>
              <input
                type='number'
                className='form-control'
                id='num_seconds'
                value={currentWorkoutExercise.num_seconds}
                onChange={handleChange("num_seconds")}
                name='num_seconds'
                placeholder='Enter number of seconds for this exercise'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='comment'>Comment to client</label>
              <input
                type='text'
                className='form-control'
                id='comment'
                value={currentWorkoutExercise.comment}
                onChange={handleChange("comment")}
                name='comment'
                placeholder='Enter comment to client'
              />
            </div>
            <button
              type='submit'
              className='m-3 btn btn-sm btn-success'
              onClick={saveWorkoutExercise}
            >
              Add to Workout
            </button>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on an Exercise...</p>
          </div>
        )}
      </div>
      <div />

      <h4>Exercises in workout:</h4>
      <div className='container'>
        {selectedExercisesList.length > 0 ? (
          <table
            style={{
              borderWidth: "1px",
              borderColor: "black",
              borderStyle: "solid"
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid"
                  }}
                >
                  Exercise name
                </th>
                <th
                  style={{
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid"
                  }}
                >
                  Number of sets
                </th>
                <th
                  style={{
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid"
                  }}
                >
                  Number of reps
                </th>
                <th
                  style={{
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid"
                  }}
                >
                  Number of seconds
                </th>
                <th
                  style={{
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid"
                  }}
                >
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedExercisesList.map((exercise) => (
                <tr key={exercise.id}>
                  <td
                    style={{
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid"
                    }}
                  >
                    {exercise.name}
                  </td>
                  <td
                    style={{
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid"
                    }}
                  >
                    {exercise.num_sets}
                  </td>
                  <td
                    style={{
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid"
                    }}
                  >
                    {exercise.num_reps}
                  </td>
                  <td
                    style={{
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid"
                    }}
                  >
                    {exercise.num_seconds}
                  </td>
                  <td
                    style={{
                      borderWidth: "1px",
                      borderColor: "black",
                      borderStyle: "solid"
                    }}
                  >
                    <button
                      type='submit'
                      className='btn btn-sm btn-danger'
                      onClick={() => removeExercise(exercise.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
