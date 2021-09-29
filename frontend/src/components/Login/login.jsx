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

    fetch('/api/login', {
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
      <h2 style={{textAlign: "center"}}>Login</h2>
      {!loggedIn ? <form action="#">
        <div style={{textAlign: "center", marginTop: 30}}>
          <input 
            style={{textAlign: "center"}} 
            type="text"
            placeholder="Email"
            onChange={handleUsernameChange}
            value={email}
          />
        </div>
        <div style={{textAlign: "center", marginTop: 30, marginBottom: 50}}>
          <input
            style={{textAlign: "center"}}
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <button 
          style={{marginRight: "2%", marginTop: 20, marginLeft: "40%", width: "9%"}} 
          onClick={onSubmitClick}  
          type="submit">
          Login
        </button>
        <button style={{width: "9%", textAlign: "center"}}> 
          <Link to="/register">Register</Link>
        </button>
      </form>
        : <button onClick={() => logout()}>Logout</button>}
    </div>
  )
}
