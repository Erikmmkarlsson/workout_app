import React, { Component } from "react";
import ExerciseDataService from "../services/exercise.service";

export default class Exercise extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getExercise = this.getExercise.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateExercise = this.updateExercise.bind(this);
    this.deleteExercise = this.deleteExercise.bind(this);

    this.state = {
      currentExercise: {
        id: null,
        name: "",
        description: "",
        published: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getExercise(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentExercise: {
          ...prevState.currentExercise,
          name: name
        }
      };
    });
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
    ExerciseDataService.get(id)
      .then(response => {
        this.setState({
          currentExercise: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentExercise.id,
      name: this.state.currentExercise.name,
      description: this.state.currentExercise.description,
      published: status
    };

    ExerciseDataService.update(this.state.currentExercise.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentExercise: {
            ...prevState.currentExercise,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateExercise() {
    ExerciseDataService.update(
      this.state.currentExercise.id,
      this.state.currentExercise
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The exercise was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteExercise() {    
    ExerciseDataService.delete(this.state.currentExercise.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/exercises')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentExercise } = this.state;

    return (
      <div>
        {currentExercise ? (
          <div className="edit-form">
            <h4>Exercise</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentExercise.name}
                  onChange={this.onChangeName}
                />
              </div>
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

            {currentExercise.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteExercise}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
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