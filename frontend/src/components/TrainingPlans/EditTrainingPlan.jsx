import React, { useEffect, useState } from 'react'
import { GetToken } from '../auth'
import axios from 'axios';
import { Table } from 'reactstrap'
import { CreateEvent } from './CreateEvent';

const EditTrainingPlan = (props) => {
  //const managerId = GetID();
  const [users, setUsers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [selectedUser, setSelectedUser] = useState(0)
  const [trainingPlan, setTrainingPlan] = useState(0)
  const [selected, setSelected] = useState(false)
  const [selectedWorkoutEvents, setSelectedWorkoutEvents] = useState([])
  console.log(selectedUser)


  useEffect(() => {
    axios.get('/api/manager/myUsers', { headers: { 'x-access-token': GetToken() } }).then((response) => {
      setUsers(response.data.data)
    });
  }, []);


  //When selected user is updated, get workouts from that user
  useEffect(() => {
    axios.get('/api/users_workout_events/' + selectedUser, { headers: { 'x-access-token': GetToken() } })
      .then((response) => {
        setSelectedWorkoutEvents(response.data.data)
      });

      axios.get('/api/GetTrainingplanIdByClientID/'+ selectedUser, {
        headers: {
          'x-access-token': GetToken()
        }
      })
      .then((response) => {setTrainingPlan(response.data.data)})

  }, [selectedUser]);

  console.log(selectedWorkoutEvents)

  

  return (
    <div>
      <ul className='list-group'>
        {users &&
          users.map((user, key) => (
            <li
              className={
                'list-group-item ' + (key === currentIndex ? 'active' : '')
              }
              onClick={() => {
                setSelectedUser(user.id)
                setCurrentIndex(key)
                setSelected(true)
              }}
              key={key}
            >
              {user.name}
            </li>
          ))}
      </ul>
      {selected ? (
        <div>
          <Table style={{ background: 'white', marginTop: "1rem", width: "100%" }}>
            <thead> <tr>
              <th>Date</th>
              <th>Workout Name</th>
              <th>Comment</th>
            </tr></thead>
            <tbody>
              {selectedWorkoutEvents.sort(function (a, b) {
                var dateA = new Date(a.date), dateB = new Date(b.date)
                return dateA - dateB
              }).map((workout, key) =>
                <tr>
                  <td >{workout.date} </td>
                  <td >{workout.name} </td>
                  <td >{workout.manager_comment} </td>

                </tr>)}
            </tbody>
          </Table>
          <CreateEvent  
          selectedUser={selectedUser}
          trainingPlan={trainingPlan}
          />
        </div>) : null}



    </div>
  )
}

export default EditTrainingPlan
