import React, { Component } from "react";
import { ReactDOM } from "react-dom";
import axios from "axios";
import _ from 'lodash';


export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: []
    };

    this.renderExercises = this.renderExercises.bind(this);
  }

  componentWillMount() {
    axios
        .get('localhost:8000/api/exercises')
        .then(({response}) => {
            console.log(response.json);
            this.setState(
                { exercises: response }
            );
        })
        .catch((err) => {})
  }

  render() {
    console.log(this.state.exercises);
    return (
        <div>
          <h4>Exercises List</h4>
          <ul className="list-group">
            {this.renderExercises()}
          </ul>
      </div>
    );
  }

  renderExercises() {
      console.log(this.state.exercises);
      return this.state.exercises.map(exercise => {
          <li>
              {exercise.name}
          </li>
      })
  }
}