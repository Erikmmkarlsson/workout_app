import React, { Component } from "react";
import { ReactDOM } from "react-dom";
import axios from "axios";
import _ from 'lodash';
import { Link } from "react-router-dom";



export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveExercise = this.setActiveExercise.bind(this);
    this.removeAllExercises = this.removeAllExercises.bind(this);
    this.searchName = this.searchName.bind(this);

    this.state = {
      exercisesList: [],
      currentExercise: null,
      currentIndex: -1,
      searchName: ""
    };
  }

  componentDidMount() {
    /*
    fetch("http://localhost:8000/api/exercises")
      .then(response => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          exercisesList: data.data.map(exercise => ({
            name: exercise.name,
            description: exercise.description
          }))
        });
        console.log(data)
      })
      */
     axios.get("http://localhost:8000/api/exercises")
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        })
      })
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    })
  }

  refreshList() {
    this.retrieveExercises();
    this.setState({
      currentExercise: null,
      currentIndex: -1
    });
  }

  setActiveExercise(exercise, index) {
    this.setState({
      currentExercise: exercise,
      currentIndex: index
    });
  }

  removeAllExercises() {
    /*
    ExerciseDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    */
  }

  searchName() {
    /*
    ExerciseDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          exercisesList: response.data.data
        });
      })
    */
  }



  render() {
    const { searchName, exercisesList, currentExercise, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by exercise name"
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchName}
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
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveExercise(exercise, index)}
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

              <Link
                to={"/exercises/" + currentExercise.id}
                className="btn btn-warning"
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
      </div>
    );
  }
}
/*
  render() {
    return (
      <div>
        <h4>Exercises</h4>
          <ul>
            {this.state.exercisesList.map(exercise => (
<<<<<<< HEAD
              <li>{exercise.name} {exercise.description}</li>
=======
              <li>{exercise.name}</li>
>>>>>>> 7acebdcfe4989cd20c083aa2ec9c5d1f5e6c33d4
            ))}
          </ul>
      </div> 
    )
  }
*/
