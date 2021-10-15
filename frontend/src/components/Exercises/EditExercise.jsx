import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Modal } from 'reactstrap'
import axios from 'axios'

export default function EditExercise(props) {
  // States
  const [modal, setModal] = useState(false)
  const [id, setId] = useState(null)
  const [values, setValues] = useState({
    description: '',
    video_link: ''
  })

  // Variables
  const history = useHistory()
  const toggle = () => setModal(!modal)

  // Handles initial state
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

  // Functions
  const handleChange = (name) => (e) => {
    // Handles when a user types text into a field, updates said variable
    setValues({ ...values, [name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    // Handles when the user submits, patches the exercise in the database
    e.preventDefault()
    const { description, video_link } = values
    const exercise_data = { description, video_link }
    await axios.patch('/api/exercises/' + id, exercise_data)
    history.goBack()
  }

  function deleteExercise() {
    // Handles when the user clicks on "delete", removes the exercise from the database
    axios.delete('/api/exercises/' + id)
  }

  return (
    <div className='Exercise'>
      <Modal isOpen={modal} toggle={toggle}>
        <div><h4>Are you sure you want to delete this exercise?</h4></div>
        <div>
          <Link to='/exercises'>
            <button
              className='m-3 btn btn-sm btn-danger'
              onClick={deleteExercise}
            >
              Delete
            </button>
          </Link>
          <button
              className='m-3 btn btn-sm btn-warning'
              onClick={toggle}
            >
              Cancel
            </button>
        </div>
      </Modal>
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
        <button
          className='m-3 btn btn-sm btn-danger'
          onClick={toggle}
        >
          Delete
        </button>
        <button onClick={handleSubmit} className='m-3 btn btn-sm btn-success'>
          Update
        </button>
      </div>
    </div>
  )
}
