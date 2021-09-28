import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
var md5 = require("md5");

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.onChangePassword = this.onChangePassword.bind(this);
       
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    
    this.state = {
      currentProfile: {
        id: this.props.match.params.id,
        name: "",
        email: "",
        password: "",
        role: ""
      },
      message: ""
    };
  }

  
  componentDidMount() {
    this.getProfile(this.props.match.params.id);
  }
  

  onChangePassword(e) {
    const password = e.target.value;
    
    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        password: md5(password)
      }
    }));
  }

 
  getProfile(id) {
    axios.get("/api/users/" + id)
      .then(response => {
        this.setState({
          currentProfile: response.data.data
        });
      })
  }

  updateProfile() {
    axios.patch("/api/users/" + this.state.currentProfile.id, this.state.currentProfile)
      .then(response => {
        console.log(response.data.data);
        this.setState({
          message: "The profile was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

 

  render() {
    const { currentProfile } = this.state;

    return (
      <div>
        <div>
          <Link
            to={"/profile/" + currentProfile.id}
            className="btn btn-warning"
            style={{ marginTop: 25 }}
            >
              Back
          </Link>
        </div>
        {currentProfile ? (
          <div className="edit-form">
            <h4>Change Password</h4>
            <form>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  /*value=""*/
                  onChange={this.onChangePassword}
                />
              </div>

             

              

             
            </form>
            
            <Link to="/editpassword">
              <button
                type="submit"
                className="m-3 btn btn-sm btn-success"
                onClick={this.updateProfile}
              >
                Update
              </button>
            </Link>
            <p>
              {this.state.message}
            </p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please write again...</p>
          </div>
        )}
      </div>
    );
  }
}