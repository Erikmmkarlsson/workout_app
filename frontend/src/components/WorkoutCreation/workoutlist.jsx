import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function WorkoutList(props) {
  const [workoutList, setWorkoutList] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    axios.get("/api/workouts").then((response) => {
      setWorkoutList(response.data.data);
    });
  }, []);

  function setActiveWorkout(workout, index) {
    setCurrentWorkout(workout);
    setCurrentIndex(index);
  }

  function removeWorkout(id){
    axios.delete("/api/workouts/" + id);
    window.location.reload(false);
  }

  return (
    <div className="list row">
      <Link to="/managerdashboard">
        <button className="m-3 btn-sm btn-warning">Return to dashboard</button>
      </Link>
      <div className="col-md-6">
        <h4>Your workouts</h4>
        <ul className="list-group">
          {workoutList &&
            workoutList.map((workout, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveWorkout(workout, index)}
                key={index}
              >
                {workout.name}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-md-6">
        {currentWorkout ? (
          <div>
            <h4>Selected workout:</h4>
            <div>
              <label>
                <strong>Name</strong>
              </label>{" "}
              {currentWorkout.name}
            </div>
            <div>
            <Link
              to={"/workoutcreation/edit?id=" + currentWorkout.id}
              className="btn btn-warning"
              style={{ marginTop: 25 }}
            >
              Add exercises
            </Link>
            </div>
            <div>
            <button
              onClick={() => removeWorkout(currentWorkout.id)}
              className="btn btn-danger"
              style={{ marginTop: 25 }}
            >
              Delete workout
            </button>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Workout...</p>
          </div>
        )}
      </div>
      <div>
        <Link
          to="/workoutcreation/create"
          className="btn btn-success"
          style={{ marginTop: 25 }}
        >
          Add new
        </Link>
      </div>
    </div> // Test
  );
}
