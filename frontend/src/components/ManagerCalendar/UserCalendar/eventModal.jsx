import React from 'react'
import WorkoutReport from './WorkoutReport'
import StartWorkout from './StartWorkout'
import {
  Table,
  Button,
  Modal,
  ModalFooter
} from 'reactstrap'
import { GetRole } from '../../auth'


export default function eventModal(modal, toggleModal, selectedWorkoutExercises, OpenLink, selectedEvent, added, hasAdded) {
    return <Modal isOpen={modal} toggle={toggleModal}>
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
      
      {(GetRole()==='client')? (
          <ModalFooter>
          <StartWorkout
            exerciseList={selectedWorkoutExercises} />
    
          <WorkoutReport
            toggleModal={toggleModal}
            selectedEvent={selectedEvent.id}
            added={added}
            hasAdded={hasAdded} />
        </ModalFooter>
      ): null}
    
    </Modal>
  }
  