import { login, useAuth, logout } from "../auth"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './login.css'
import RegisterUser from "./RegisterUser"
import{
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Form,
  Toast,
  ToastHeader,

} from 'reactstrap';


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
    <div class="login" id="login">
      <Toast>
      <h2 style={{textAlign: "center",}}>
          Login
      </h2>
      </Toast>
      <Toast>
      {!loggedIn ? <form action="#">
      <Form className="login-form">
        <div style={{textAlign: "center", marginTop: 30}}>
            <FormGroup>
                <Label>Email</Label>
                <Input 
                style={{textAlign: "center"}} 
                type="text"
                placeholder="Email"
                onChange={handleUsernameChange}
                value={email}
                />
                </FormGroup>
                <FormGroup>
                <Label>Password</Label>
                <Input
                 style={{textAlign: "center"}}
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                value={password}
                />
            </FormGroup>
         
        </div>
        <div class="buttons">
            <FormGroup>
            <Row>
            <Button
                color="dark"
                onClick={onSubmitClick}  
                type="submit"
                style={{textAlign: "center",fontSize:"1.7rem"}}             
                >Log in
                </Button>
            </Row>
            
            </FormGroup>
          </div>
          </Form>
          <div>
            <Label
            style={{marginLeft: 110, marginBottom:20,fontSize:"1.5rem"}}>Or sign up using
            </Label>
            <RegisterUser>
            </RegisterUser>
           </div>
      </form>
        : <button onClick={() => logout()}>Logout</button>}
       
     </Toast>
    </div>
    
  )
}
