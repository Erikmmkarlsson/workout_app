import React from 'react'
import { Link } from 'react-router-dom'

export default function ManagerDashboard (props) {
  return (
    <div>
      <Link to='/'><button className='m-3 btn-sm btn-success'>Clients</button></Link>
      <Link to='/'><button className='m-3 btn-sm btn-success'>Training Plans</button></Link>
      <Link to='/workoutcreation'><button className='m-3 btn-sm btn-success'>Workouts</button></Link>
      <Link to='/exercises'><button className='m-3 btn-sm btn-success'>Exercises</button></Link>
    </div>
  )
}
