import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class AddExercise extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeVideoLink = this.onChangeVideoLink.bind.bind(this);
    this.saveExercise = this.saveExercise.bind(this);
    this.newExercise = this.newExercise.bind(this);

    this.state = {
      id: null,
      name: "",
      description: "", 
      video_link: ""
    };
  }



  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeVideoLink(e) {
    this.setState({
      video_link: e.target.value
    });
  }

  saveExercise() {
    axios({
      method: 'post',
      url: 'http://localhost:8000/api/exercises',
      data: {
        name: this.state.name,
        description: this.state.description,
        video_link: this.state.video_link
      }
    });
  }

  newExercise() {
    this.setState({
      id: null,
      name: "",
      description: "",
      video_link: ""
    });
  }



  render() {
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
        <div className="submit-form">
          <div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
                placeholder="Enter a name for the exercise"
                style={{ width: "500px" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
                placeholder="Enter a description for the exercise"
                style={{ width: "500px" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Video Link</label>
              <input
                type="text"
                className="form-control"
                id="video_link"
                required
                value={this.state.video_link}
                onChange={this.onChangeVideoLink}
                name="video_link"
                placeholder="Add a video link, format 'youtube.com/...'"
                style={{ width: "500px" }}
              />
            </div>
            <Link to="/exercises">
              <button 
                onClick={this.saveExercise} 
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