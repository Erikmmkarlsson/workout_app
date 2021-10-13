import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, FormGroup, Input, Label, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import { GetToken } from '../auth'

export const CreateEvent = (props) => {
  //Props from parent component
  const { selectedUser, trainingPlan, setPressed, pressedAdd } = props

  //States
  const [open, setOpen] = useState(false)
  const [workoutList, setWorkoutList] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState({ id: 0, name: '' })
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')
  const [dropdownOpenWorkouts, setDropdownOpenWorkouts] = useState(false)
  const toggleWorkouts = () => setDropdownOpenWorkouts(prevState => !prevState)

  //Set initial state
  useEffect(() => {
    axios.get('/api/GetUser&UserManagerWorkouts/' + selectedUser, {
      headers: {
        'x-access-token': GetToken()
      }
    })
      .then((response) => {
        setWorkoutList(response.data.data)
      })
  }, [])

  //Function
  const handleButton = async (e) => {
    //Handles button press, inserts training plan into database
    const data = {
      training_plan_id: trainingPlan[0].id,
      workout_id: selectedWorkout.id,
      date: date,
      manager_comment: comment
    }
    console.log(data)
    await axios.post('/api/workout_events', data)
      .then(response => setPressed(!pressedAdd))
  }

  const handleDateChange = (e) => {
    //Handles when user enters a new date, updates variable
    setDate(e.target.value)
  }

  const handleCommentChange = (e) => {
    //Handles when user enters a comment, updates variable
    setComment(e.target.value)
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add new event </Button>

      {open
        ? (<div>
          <Form>
            <FormGroup>
              <Label for='date'>Date</Label>
              <Input
                type='date'
                name='date'
                id='date'
                placeholder='date'
                onChange={handleDateChange}
                value={date}
              />
            </FormGroup>
            <FormGroup>
              <Dropdown group isOpen={dropdownOpenWorkouts} toggle={toggleWorkouts}>
                <DropdownToggle color='info' caret placeholder='Select workout'>
                  {selectedWorkout.name}
                </DropdownToggle>
                <DropdownMenu modifiers={{
                  setMaxHeight: {
                    enabled: true,
                    order: 890,
                    fn: (data) => {
                      return {
                        ...data,
                        styles: {
                          ...data.styles,
                          overflow: 'auto',
                          maxHeight: '100px'
                        }
                      }
                    }
                  }
                }}
                >
                  {workoutList.map((workout, key) =>
                    <DropdownItem onClick={() =>
                      (setSelectedWorkout({ id: workout.id, name: workout.name }))}
                    >
                      {workout.name}
                    </DropdownItem>)}
                </DropdownMenu>
              </Dropdown>

            </FormGroup>
            <FormGroup>
              <Label for='comment'>Comment</Label>
              <Input
                type='textarea'
                name='text'
                id='comment'
                placeholder='Add a helpful comment...'
                onChange={handleCommentChange}
                value={comment}
              />
            </FormGroup>

          </Form>
          <button
            className='btn btn-success'
            style={{ marginTop: 25 }}

            onClick={() => { handleButton() }}
          >Add workout
          </button>

        </div>)
        : null}

    </div>
  )
}
