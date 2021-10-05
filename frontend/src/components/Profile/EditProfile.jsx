import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GetID, GetToken } from '../auth'

export default class Profile extends Component {
  constructor (props) {
    super(props)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)

    this.onChangeRole = this.onChangeRole.bind(this)

    this.getProfile = this.getProfile.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
    this.deleteProfile = this.deleteProfile.bind(this)

    this.state = {
      currentProfile: {
        id: GetID(),
        name: '',
        email: '',
        password: '',
        role: ''
      },
      message: ''
    }
  }

  componentDidMount () {
    this.getProfile(GetID())
  }

  onChangeName (e) {
    const name = e.target.value

    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        name: name
      }
    }))
  }

  onChangeEmail (e) {
    const email = e.target.value

    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        email: email
      }
    }))
  }

  onChangeRole (e) {
    const role = e.target.value

    this.setState(prevState => ({
      currentProfile: {
        ...prevState.currentProfile,
        role: role
      }
    }))
  }

  getProfile (id) {
    axios.get('/api/profile/' + id, {
      headers: {
        'x-access-token': GetToken()
      }
    })
      .then(response => {
        this.setState({
          currentProfile: response.data.data
        })
      })
  }

  updateProfile () {

    axios.patch('/api/profile/', this.state.currentProfile, {
      headers: {
        'x-access-token': GetToken()
      }})
      .then(response => {
        console.log(response.data.data)
        this.setState({
          message: 'The profile was updated successfully!'
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  //TODO: Improve this functionality
  deleteProfile () {
    axios.delete('/api/profile/')
  }

  render () {
    const { currentProfile } = this.state

    return (
      <div>
        <div>
          <Link
            to={'/profile/'}
            className='btn btn-warning'
            style={{ marginTop: 25 }}
          >
            Back
          </Link>
          <Link
            to={'/passwordreset/'}
            className='btn btn-warning'
            style={{ marginTop: 25, marginLeft: 10 }}
          >
            Change Password
          </Link>
        </div>

        {currentProfile ? (
          <div className='edit-form'>
            <h4>Edit Profile</h4>
            <form>
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  value={currentProfile.name}
                  onChange={this.onChangeName}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='text'
                  className='form-control'
                  id='email'
                  value={currentProfile.email}
                  onChange={this.onChangeEmail}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='role'>Role</label>
                <input
                  type='text'
                  className='form-control'
                  id='role'
                  value={currentProfile.role}
                  onChange={this.onChangeRole}
                />
              </div>

            </form>
            <Link to='/editprofile'>
              <button
                className='m-3 btn btn-sm btn-danger'
                onClick={this.deleteProfile}
              >
                Delete
              </button>
            </Link>
            <Link to={'/profile/'}>
              <button
                type='submit'
                className='m-3 btn btn-sm btn-success'
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
            <p>Please choose right person...</p>
          </div>
        )}
      </div>
    )
  }
}
