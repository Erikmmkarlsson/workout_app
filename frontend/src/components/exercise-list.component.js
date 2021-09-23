import React, { Component } from "react";
import { ReactDOM } from "react-dom";
import axios from "axios";
import _ from 'lodash';



export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercisesList: []
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

  render() {
    return (
      <div>
        <h4>Exercises</h4>
          <ul>
            {this.state.exercisesList.map(exercise => (
              <li>{exercise.name}</li>
            ))}
          </ul>
      </div> 
    )
  }
}