import React, { useState, useEffect } from 'react'
import axios from 'axios'
import WorkoutReport from './WorkoutReport'
import StartWorkout from './StartWorkout'
import {
  Table,
  Button,
  Modal,
  ModalFooter,
  Alert
} from 'reactstrap'
import { GetRole } from '../../auth'


const EventModal = props => {
  const { modal, toggleModal, selectedWorkoutExercises, OpenLink, selectedEvent, added, hasAdded } = props

  const [workoutEvent, setWorkoutEvent] = useState(null)

  //Get event every time event is updated
  useEffect(() => {
    axios.get('/api/workout_events/' + selectedEvent.id)
      .then((response) => {
        setWorkoutEvent(response.data.data)
      }).then(console.log(workoutEvent))
  }, [selectedEvent])



  return (<Modal isOpen={modal} toggle={toggleModal}>

    {(workoutEvent && workoutEvent.manager_comment) ? (<Alert>
      <h4 className="alert-heading">Tip from the coach</h4>
      <p>{workoutEvent.manager_comment}</p>
    </Alert>) : null}

    {(workoutEvent && workoutEvent.client_comment) ? (<Alert color="secondary">
      <h4 className="alert-heading">Client thoughts</h4>
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

    {(GetRole() === 'client') ? (
      <ModalFooter>
        <StartWorkout
          exerciseList={selectedWorkoutExercises} />

        <WorkoutReport
          toggleModal={toggleModal}
          selectedEvent={selectedEvent.id}
          added={added}
          hasAdded={hasAdded} />
      </ModalFooter>
    ) : null}

  </Modal>)
}

export default EventModal
