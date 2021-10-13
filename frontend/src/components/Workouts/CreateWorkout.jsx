import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { GetID } from "../auth"
import "./Workout.css"

export default function CreateWorkout(props) {
  //States
  const [values, setValues] = useState({
    name: '',
    creator: GetID()
  })

  //Variables
  const history = useHistory()

  //Functions
  const handleChange = (name) => (e) => {
    //Handles when user types text into field, updates said variable
    setValues({ ...values, [name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    //Handles when a user submits, posts the workout to the database
    e.preventDefault()
    const { name, creator } = values
    const workout_data = { name, creator }
<<<<<<< HEAD
    await axios.post("/api/workouts", workout_data)
=======
    await axios.post('/api/workouts', workout_data)
>>>>>>> ac2507e43c8fb0abd6964847b82f0bcebeb08cc6
    history.goBack()
  }

  return (
    <div className="Workout">
      <div>
        <button
          className="btn btn-warning"
          style={{ marginTop: 25 }}
          onClick={history.goBack}
        >
          Go back
        </button>
      </div>
      <div className="submit-form">
        <div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={values.name}
              onChange={handleChange("name")}
              name="name"
              placeholder="Enter a name for this workout"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="btn btn-success"
            style={{ marginTop: 25 }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
