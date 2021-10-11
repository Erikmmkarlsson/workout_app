import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'

export default function EditExercise (props) {
  const [id, setId] = useState(null)
  const [values, setValues] = useState({
    description: '',
    video_link: ''
  })

  const history = useHistory()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = parseInt(params.get('id'), 10)
    setId(id)
    axios.get('/api/exercises/' + id).then((response) => {
      setValues({
        description: response.data.data.description,
        video_link: response.data.data.video_link
      })
    })
  }, [])

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { description, video_link } = values
    const exercise_data = { description, video_link }
    await axios.patch('/api/exercises/' + id, exercise_data)
    history.goBack()
  }

  function deleteExercise () {
    axios.delete('/api/exercises/' + id)
  }

  return (
    <div className='Exercise'>
      <div>
        <Link
          to='/exercises/'
          className='btn btn-warning'
          style={{ marginTop: 25 }}
        >
          Back
        </Link>
      </div>
      <div className='edit-form'>
        <h4>Edit Exercise</h4>
        <form>
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              className='form-control'
              id='description'
              value={values.description}
              onChange={handleChange('description')}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='video_link'>Video Link</label>
            <input
              type='text'
              className='form-control'
              id='video_link'
              value={values.video_link}
              onChange={handleChange('video_link')}
            />
          </div>
        </form>
        <Link to='/exercises'>
          <button
            className='m-3 btn btn-sm btn-danger'
            onClick={deleteExercise}
          >
            Delete
          </button>
        </Link>
        <button onClick={handleSubmit} className='m-3 btn btn-sm btn-success'>
          Update
        </button>
      </div>
    </div>
  )
}
