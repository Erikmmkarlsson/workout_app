import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

export const CreateEvent = (props) => {

  const [values, setValues] = useState({
    workout_id: '',
    date: '',
    manager_comment: ''
  })

  const history = useHistory()

  const handleChange = (Name) => (e) => {
    setValues({ ...values, [Name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { workout_id: workout_id, date: date, manager_comment: manager_comment } = values
    const workout_data = { workout_id: workout_id, date: date, manager_comment: manager_comment }
    await axios.post('/api/exercises', workout_data)
    history.goBack()
  }

  return (
    <div>
      <div>
        <button
          className='btn btn-warning'
          style={{ marginTop: 25 }}
          onClick={history.goBack}
        >
          Go back
        </button>
      </div>
      <div className='submit-form'>
        <div>
          <div className='form-group'>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              className='form-control'
              id='date'
              required
              value={values.date}
              onChange={handleChange('date')}
              name='date'
              placeholder='Enter a date'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='workout_id'>workout_id</label>
            <input
              type='text'
              className='form-control'
              id='workout_id'
              required
              value={values.workout_id}
              onChange={handleChange('workout_id')}
              name='workout_id'
              placeholder='Enter a workout_id for the exercise'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='comment'>Comment</label>
            <input
              type='text'
              className='form-control'
              id='comment'
              value={values.manager_comment}
              onChange={handleChange('comment')}
              name='comment'
              placeholder="Add a comment for the client..."
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
