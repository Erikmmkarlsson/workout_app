import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import './Exercise.css'

export default function AddExercise(props) {
  // States
  const [values, setValues] = useState({
    name: "",
    description: '',
    video_link: ''
  })

  const history = useHistory()

  // Functions
  const handleChange = (name) => (e) => {
    // Handles changes when user types text into fields, updates said variable
    setValues({ ...values, [name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    // Handles submit, posts the created exercise to the database
    e.preventDefault()
    const { name, description, video_link } = values
    const exercise_data = { name, description, video_link }
    await axios.post('/api/exercises', exercise_data)
    history.goBack()
  }

  return (
    <div className='Exercise'>
      <div>
        <button
          className='btn btn-warning'
          style={{ marginTop: 25 }}
          onClick={() => history.goBack()}
        >
          Go back
        </button>
      </div>
      <div className='submit-form'>
        <div>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              className='form-control'
              id='name'
              required
              value={values.name}
              onChange={handleChange('name')}
              name='name'
              placeholder='Enter a name for the exercise'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              className='form-control'
              id='description'
              required
              value={values.description}
              onChange={handleChange('description')}
              name='description'
              placeholder='Enter a description for the exercise'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Video Link (Optional)</label>
            <input
              type='text'
              className='form-control'
              id='video_link'
              value={values.video_link}
              onChange={handleChange('video_link')}
              name='video_link'
              placeholder="Add a video link, format 'youtube.com/...'"
            />
          </div>

          <button
            onClick={handleSubmit}
            className='btn btn-success'
            style={{ marginTop: 25 }}
          >
            Submit
          </button>
          
        </div>
      </div>
    </div>
  )
}
