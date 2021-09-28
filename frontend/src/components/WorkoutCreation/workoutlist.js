import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



export default class WorkoutList extends Component {
  constructor(props) {
    super(props);
    this.setActiveWorkout = this.setActiveWorkout.bind(this);

    this.state = {
      workoutList: [],
      currentWorkout: null,
      currentIndex: -1
    };
  }

  componentDidMount() {
    axios.get("/api/workouts")
      .then(response => {
        this.setState({
          workoutList: response.data.data
        })
      })
  }

  setActiveWorkout(workout, index) {
    this.setState({
      currentWorkout: workout,
      currentIndex: index
    });
  }




  render() {
    const { workoutList, currentWorkout, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <h4>Your workouts</h4>
          <ul className="list-group">
            {workoutList &&
              workoutList.map((workout, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveWorkout(workout, index)}
                  key={index}
                >
                  {workout.client_id}
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          {currentWorkout ? (
            <div>
              <h4>Workout</h4>
              <div>
                <label>
                  <strong>
                   Client ID:
                  </strong>
                </label>{" "}
                {currentWorkout.client_id}
              </div>
              <div>
                <label>
                  <strong>
                    Done:
                  </strong>
                </label>{" "}
                {currentWorkout.is_done ? (
                    <p>Yes</p>
                ) : (
                    <p>No</p>
                )}
              </div>
              <div>
                <label>
                  <strong>
                    Comment:
                  </strong>
                </label>{" "}
                {currentWorkout.comment}
              </div>
              <Link
                to={"/workoutcreation/edit/" + currentWorkout.id}
                className="btn btn-warning"
                style={{ marginTop: 25 }}
              >
                Edit
              </Link>
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
            to={"/workoutcreation/createworkout"}
            className="btn btn-success"
            style={{ marginTop: 25 }}
          >
            Add new
          </Link>
        </div>
      </div>
    );
  }
}
