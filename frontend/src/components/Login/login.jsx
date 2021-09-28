import { login, useAuth, logout } from "../auth"
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn] = useAuth();

  const onSubmitClick = (e) => {
    e.preventDefault()
    console.log("You pressed login")
    let credentials = {
      'email': email,
      'password': password
    }

    fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.token) {
          login(data)
        }
        else {
          console.log("Please type in correct email/password")
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
    <div className="login" id="login">
      <h2>Login</h2>
      {!loggedIn ? <form action="#">
        <div>
          <input type="text"
            placeholder="Email"
            onChange={handleUsernameChange}
            value={email}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <button onClick={onSubmitClick} type="submit">
          Login Now
        </button>
        <button><Link to="/register">Register</Link></button>
      </form>
        : <button onClick={() => logout()}>Logout</button>}
    </div>
  )
}