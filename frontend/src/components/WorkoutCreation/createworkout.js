import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class CreateWorkout extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveWorkout = this.saveWorkout.bind(this);
    this.newWorkout = this.newWorkout.bind(this);

    this.state = {
      id: null,
      name: ""
    };
  }



  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveWorkout() {
    axios({
      method: 'post',
      url: '/api/workouts',
      data: {
        name: this.state.name
      }
    });
  }

  newWorkout() {
    this.setState({
      id: null,
      name: ""
    });
  }



  render() {
    return (
      <div>
        <div>
          <Link
            to={"/"}
            className="btn btn-warning"
            style={{ marginTop: 25 }}
            >
            Back
          </Link>
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
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
                placeholder="Enter a name for this workout"
              />
            </div>
            <Link to="/workoutcreation">
              <button 
                onClick={this.saveWorkout} 
                className="btn btn-success"
                style={{ marginTop: 25 }}
                >
                Submit
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}