import React from 'react'
import { Jumbotron, Button } from 'reactstrap'
import './landingpage.css'
const Hero = (props) => {
  return (
    <div className='jumbotron'>
      <Jumbotron>
        <div className='box'>
          <div className='text-container'>
            <h1 className='display-1'>Welcome to Gymific</h1>
            <p className='lead'>Your personal trainer, in your phone.</p>
            <hr className='my-2' />
            <p>Find exercises, plan workouts and connect with coaches and friends.</p>
            <p className='lead'>
              <Button color='secondary' href='/login'>Sign up today</Button>
            </p>
          </div>
        </div>
      </Jumbotron>
    </div>
  )
}

export default Hero
