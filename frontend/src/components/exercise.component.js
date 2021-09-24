import React, { Component } from "react";
import ExerciseDataService from "../services/exercise.service";
import axios from 'axios';
import { Link } from "react-router-dom";

export default class Exercise extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getExercise = this.getExercise.bind(this);
    this.updateExercise = this.updateExercise.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);

    this.state = {
      currentExercise: {
        id: this.props.match.params.id,
        description: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getExercise(this.props.match.params.id);
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentExercise: {
        ...prevState.currentExercise,
        description: description
      }
    }));
  }

  getExercise(id) {
    axios.get(id)
      .then(response => {
        this.setState({
          currentExercise: response.data.data
        });
      })
  }

  updateExercise() {
    axios.patch("http://localhost:8000/api/exercises/" + this.state.currentExercise.id, this.state.currentExercise)
      .then(response => {
        console.log(response.data.data);
        this.setState({
          message: "The exercise was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteExercise() {    
    axios.delete("http://localhost:8000/api/exercises/" + this.state.currentExercise.id);
  }

  

  render() {
    const { currentExercise } = this.state;

    return (
      <div>
        <div>
          <Link
            to={"/exercises/"}
            className="btn btn-warning"
            style={{ marginTop: 25 }}
            >
              Back
          </Link>
        </div>
        {currentExercise ? (
          <div className="edit-form">
            <h4>Edit Exercise</h4>
            <form>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentExercise.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentExercise.published ? "Published" : "Pending"}
              </div>
            </form>
            <Link to="/exercises">
              <button
                className="m-3 btn btn-sm btn-danger"
                onClick={this.deleteExercise}
                >
                Delete
              </button>
            </Link>
            <button
              type="submit"
              className="m-3 btn btn-sm btn-success"
              onClick={this.updateExercise}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
          
        ) : (
          <div>
            <br />
            <p>Please click on a Exercise...</p>
          </div>
        )}
      </div>
    );
  }
}