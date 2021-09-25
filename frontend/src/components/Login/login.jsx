

import './login.css';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';


//Communicates with api (with fetch)
async function loginUser(credentials) {
    return fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => console.log(data.json()))
   }


export default function Login({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();


       const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          email,
          password
        });
        setToken(token);
      }

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>

                    <Link to="/register">
                        <button type="register">Register</button> 
                    </Link>

                </div>
            </form>
        </div>
    )
}


Login.propTypes = {
  setToken: PropTypes.func.isRequired
}