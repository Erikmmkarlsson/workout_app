import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GetToken, GetID } from '../auth'

export default class ViewProfile extends Component {
  constructor (props) {
    super(props)

    this.getProfile = this.getProfile.bind(this)

    if (this.props.match !== undefined){
    this.state = {
      otherProfile: true,
      currentProfile: {
        id: this.props.match.params.id,
        name: '',
        email: '',
        password: '',
        role: '',
        manager: ''
      },
      message: ''
    }
  }
  else{
    this.state = {
      otherProfile: false,
      currentProfile: {
        id: GetID(),
        name: '',
        email: '',
        password: '',
        role: '',
        manager: ''
      },
      message: ''
    }
  }
  }

  componentDidMount () {
    this.getProfile(this.state.currentProfile.id)
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

  render () {
    const { currentProfile } = this.state

    return (
      <div className='Profile'>
        {!this.state.otherProfile ? (<div>
          <Link
            to='/editprofile/'
            className='btn btn-warning'
            style={{ marginTop: 25 }}
          >
            Back
          </Link>
          <Link
            to={'/editprofile/' + currentProfile.id}
            className='btn btn-warning'
            style={{ marginTop: 25, marginLeft: 10 }}
          >
            Edit Profile
          </Link>
        </div>): null}
        

        {currentProfile ? (
          <div className='edit-form'>
            <h1>Profile</h1>
            <form>
              <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                  disabled='disabled'
                  type='text'
                  className='form-control'
                  id='name'
                  value={currentProfile.name}

                />
              </div>

              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  disabled='disabled'
                  type='text'
                  className='form-control'
                  id='email'
                  value={currentProfile.email}

                />
              </div>

              <div className='form-group'>
                <label htmlFor='role'>Role</label>
                <input
                  disabled='disabled'
                  type='text'
                  className='form-control'
                  id='role'
                  value={currentProfile.role}

                />
              </div>

              <div className='form-group'>
                <label htmlFor='role'>Manager</label>
                <input
                  disabled='disabled'
                  type='text'
                  className='form-control'
                  id='manager'
                  value={currentProfile.manager}

                />
              </div>

            </form>

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
