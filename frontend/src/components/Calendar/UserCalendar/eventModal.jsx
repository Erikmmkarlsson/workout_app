import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import WorkoutReport from './WorkoutReport'
import {
  Table,
  Button,
  Modal,
  ModalFooter,
  Alert,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import { GetRole } from '../../auth'




const EventModal = props => {
  const { modal, toggleModal, selectedWorkoutExercises, OpenLink, selectedEvent, added, hasAdded, selectedDay } = props

  const [workoutEvent, setWorkoutEvent] = useState(null)
  const [workoutName, setWorkoutName] = useState('')

  const [deleteModal, setModal] = useState(false)
  const toggleDelete = () => setModal(!deleteModal)

  function deleteEvent() {
    axios.delete('/api/workout_events/' + selectedEvent.id).then(()=>{
      hasAdded(!added)
      toggleModal()
      toggleDelete()
    })
  }

  //Get event every time event is updated
  useEffect(() => {
    axios.get('/api/workout_events/' + selectedEvent.id)
      .then((response) => {
        setWorkoutEvent(response.data.data)
        return response.data.data
      }).then((workoutEvent) =>
        axios.get('/api/workouts/' + workoutEvent.workout_id)
          .then((response) =>
            setWorkoutName(response.data.data.name)
          )
      );
  }, [selectedEvent])


  return (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader>{workoutName}</ModalHeader>
      {(workoutEvent && workoutEvent.manager_comment) ? (<Alert>
        <h5 className="alert-heading">Tip from the coach</h5>
        <p>{workoutEvent.manager_comment}</p>
      </Alert>) : null}

      {(workoutEvent && workoutEvent.client_comment) ? (<Alert color="secondary">
        <h5 className="alert-heading">Client thoughts</h5>
        <p>{workoutEvent.client_comment}</p>
      </Alert>) : null}


      <Table
        hover
        style={{
          background: 'white',
          marginTop: '1rem',
          width: '100%'
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>reps</th>
            <th>Video</th>
          </tr>
        </thead>
        <tbody>
          {selectedWorkoutExercises.map((workout) => (
            <tr>
              <td>{workout.name}</td>
              <td>{workout.num_sets}</td>
              <td>{workout.num_reps}</td>
              <td>
                <Button
                  color='primary'
                  onClick={() => OpenLink(workout.video_link)}
                >
                  Video
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ModalFooter>
        {(workoutEvent && workoutEvent.is_done) ? (
          <div>Workout completed</div>
        ) : <Button color='warning' onClick={() => toggleDelete()}>
          Delete Workout
        </Button>}

        {(GetRole() === 'client' && !(workoutEvent && workoutEvent.is_done)) ? (
          <React.Fragment>

            <WorkoutReport
              toggleModal={toggleModal}
              selectedEvent={selectedEvent.id}
              added={added}
              hasAdded={hasAdded}
              selectedDay={selectedDay} />
          </React.Fragment>
        ) : null}

        {(GetRole() === 'client' && (workoutEvent && workoutEvent.is_done)) ? (
          <React.Fragment>

            <WorkoutReport
              workoutEvent={workoutEvent}
              toggleModal={toggleModal}
              selectedEvent={selectedEvent.id}
              added={added}
              hasAdded={hasAdded}
              selectedDay={selectedDay}
            />
          </React.Fragment>
        ) : null}
      </ModalFooter>


      <Modal isOpen={deleteModal} toggle={toggleDelete}>
        <ModalHeader>Confirm delete</ModalHeader>
        <ModalBody>Are you sure you want to delete this event? </ModalBody>
        <ModalFooter>
          <Link to='/'>
            <Button
              color="danger"
              onClick={deleteEvent}
            >
              Delete
            </Button>
          </Link>
          <Button
            color="secondary"
            onClick={toggleDelete}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Modal>
  )
}

export default EventModal
