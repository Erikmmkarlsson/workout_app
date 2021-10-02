import { login, useAuth, logout } from '../auth'
import React, { useState } from 'react'
import './login.css'
import RegisterUser from './RegisterUser'
import {
  Button,
  FormGroup,
  Input,
  Row,
  Form,
  Toast,
  Alert
} from 'reactstrap'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn] = useAuth()
  const [validCredentials, setValidCredentials] = useState(true)

  const onSubmitClick = (e) => {
    e.preventDefault()
    console.log('You pressed login')
    const credentials = {
      email: email,
      password: password
    }

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => {
      if (!response.ok) {
        setValidCredentials(false)
      }
      else {
        return response.json()
      }
    })
      .then(data => {
        console.log(data)
        if (data !== undefined && data.token) {
          login(data)
        } else {
          console.log('Please type in correct email/password')
          setValidCredentials(false)
        }
      })
  }

  const handleUsernameChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div class='login' id='login'>
      <Toast>
        <h2 style={{ textAlign: 'center', margin: '10px 10px', color: "darkgray" }}>
          Login
        </h2>
      </Toast>
      <Toast>
        {!loggedIn ? <form action='#'>
          <Form className='login-form'>
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <FormGroup>
                <Input
                  style={{ textAlign: 'center', marginBottom: '10px' }}
                  type='text'
                  placeholder='Email'
                  onChange={handleUsernameChange}
                  value={email}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  style={{ textAlign: 'center' }}
                  type='password'
                  placeholder='Password'
                  onChange={handlePasswordChange}
                  value={password}
                />
              </FormGroup>

            </div>
            <div class='buttons'>
              <FormGroup>
                <Row>
                  <Button
                    color='dark'
                    onClick={onSubmitClick}
                    type='submit'
                    style={{ width: "100%" }}
                  >Log in
                  </Button>
                </Row>

              </FormGroup>

              <FormGroup>
                <RegisterUser />
              </FormGroup>
            </div>
            {!validCredentials ? (
              <Alert color='danger'>
                Please enter valid credentials
              </Alert>) : (null)}
          </Form>
          <div />
        </form>
          : <button onClick={() => logout()}>Logout</button>}

      </Toast>
    </div>

  )
}
