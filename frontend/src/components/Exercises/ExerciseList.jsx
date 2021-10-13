import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ExercisesList(props) {
  //States
  const [exercisesList, setExercisesList] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");

  //Sets initial states
  useEffect(() => {
    axios.get("/api/exercises").then((response) => {
      setExercisesList(response.data.data);
    });
  }, []);

  //Functions
  const handleChange = () => (e) => {
    //Handles changes in the search field, updates the variable containing the search term
    setSearchName(e.target.value);
  };

  function setActiveExercise(exercise, index) {
    //Set which exercise is currently selected
    setCurrentExercise(exercise);
    setCurrentIndex(index);
  }

  function search() {
    //Handles when the user searches for a exercise, fetches the exercises that match the search name
    axios.get("/api/exercises?search=" + searchName).then((response) => {
      setExercisesList(response.data.data);
    });
  }

  return (
    <div className="Exercise">
      <Link to="/">
        <button className="m-3 btn-sm btn-warning">Return to dashboard</button>
      </Link>
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by exercise name"
            value={searchName}
            onChange={handleChange("searchName")}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={search}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Exercises</h4>
        <ul className="list-group">
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
      </div>
      <div className="col-md-6">
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
            <Link
              to={"/exercises/edit?id=" + currentExercise.id}
              className="btn btn-warning"
              style={{ marginTop: 25 }}
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on an Exercise...</p>
          </div>
        )}
      </div>
      <div>
        <Link
          to="/exercises/add"
          className="btn btn-success"
          style={{ marginTop: 25 }}
        >
          Add new
        </Link>
      </div>
    </div>
  );
}
