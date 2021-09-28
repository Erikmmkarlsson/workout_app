import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class CreateWorkout extends Component {
  constructor(props) {
    super(props);
    this.onChangeId = this.onChangeId.bind(this);
    this.saveWorkout = this.saveWorkout.bind(this);
    this.newWorkout = this.newWorkout.bind(this);

    this.state = {
      id: null,
      client_id: null,
      is_done: null, 
      comment: ""
    };
  }



  onChangeId(e) {
    this.setState({
      client_id: e.target.value
    });
  }

  saveWorkout() {
    axios({
      method: 'post',
      url: '/api/workouts',
      data: {
        client_id: this.state.client_id,
        is_done: this.state.is_done,
        comment: this.state.comment
      }
    });
  }

  newWorkout() {
    this.setState({
      id: null,
      client_id: null,
      is_done: null,
      comment: ""
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
              <label htmlFor="client_id">Client ID</label>
              <input
                type="number"
                className="form-control"
                id="client_id"
                required
                value={this.state.client_id}
                onChange={this.onChangeId}
                name="client_id"
                placeholder="Enter a client_id"
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