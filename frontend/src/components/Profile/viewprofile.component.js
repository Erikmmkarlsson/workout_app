import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { GetToken } from '../auth'

export default class ViewProfile extends Component {
  constructor (props) {
    super(props)

    this.getProfile = this.getProfile.bind(this)

    this.state = {
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

  componentDidMount () {
    this.getProfile(this.props.match.params.id)
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
      <div>
        <div>
          <Link
            to='/profile/'
            className='btn btn-warning'
            style={{ marginTop: 25 }}
          >
            Back
          </Link>
          <Link
            to={'/profile/' + currentProfile.id}
            className='btn btn-warning'
            style={{ marginTop: 25, marginLeft: 10 }}
          >
            Edit Profile
          </Link>
        </div>

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
