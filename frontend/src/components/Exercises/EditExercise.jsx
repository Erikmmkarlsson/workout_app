import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
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
      <ModalHeader>Confirm delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this exercise? This action will also delete any workout entries.</ModalBody>
        <ModalFooter>
          <Link to='/exercises'>
            <Button
              color="danger"
              onClick={deleteExercise}
            >
              Delete
            </Button>
          </Link>
          <Button
            color="secondary"
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <div>
        <Link
          to='/exercises/'
          className='btn btn-secondary'
          style={{ marginTop: 25 }}
        >
          Back
        </Link>
      </div>
      <div><br></br></div>
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
        <div><br></br></div>
        <Button 
          color="success"
          onClick={handleSubmit}
        >
          Update
        </Button>{' '}
        <Button
          color="danger"
          onClick={toggle}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
