import React, { Component } from "react";
import { ReactDOM } from "react-dom";
import axios from "axios";
import _ from 'lodash';
import { response } from "express";



export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercisesList: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/exercises")
      .then(response => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          exercisesList: data.map(exercise => ({
            name: exercise.name,
            description: exercise.description
          }))
        });
        console.log(data[i])
      })
  }

  render() {
    return <ul>{this.renderItems()}</ul>;
  }

  renderItems() {
    return this.state.exercisesList.map(exercise => {
      <key={exercise.name} name={exercise.name} />;
    });
  }
}