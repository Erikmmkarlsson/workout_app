import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'
import { GetToken, GetID } from '../../auth'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CalendarBody from '../CalendarBody'
import CalendarHead from '../CalendarHead'
import '../calendar.css'
import WorkoutReport from './WorkoutReport'
import StartWorkout from './StartWorkout'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  FormGroup,
  Modal,
  ModalFooter
} from 'reactstrap'

function Calendar(props) {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  /* HOOKS */
  // Later add hook for active days from database

  // States handling the user
  const [userTrainingplan, setUserTrainingplan] = useState({ id: null, client_id: null, manager_id: null })

  // States handling the calendar and month dropdowntable
  const [dateObject, setdateObject] = useState(moment())
  const [showMonthTable, setShowMonthTable] = useState(false)
  const [selected, hasSelected] = useState(false)

  // States handling the dropdown menu selecting workouts and adding workouts
  const [workoutListDropdown, setWorkoutListDropdown] = useState([])
  const [dropdownOpenWorkouts, setDropdownOpenWorkouts] = useState(false)
  const [selectedWorkoutName, setSelectedWorkoutName] = useState('Select a Workout')
  const [selectedWorkoutID, setSelectedWorkoutID] = useState('')
  const [added, hasAdded] = useState(false)

  // States handling the workouts that are connected to the user's training plan
  const [eventList, setEventList] = useState([])
  const [selectedEvent, setSelectedEvent] = useState({ id: 0 })
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState([])

  // Variables
  const id = GetID()
  const toggleWorkouts = () => setDropdownOpenWorkouts((prevState) => !prevState)

  // Set initial state
  useEffect(() => {
    axios
      .get('/api/GetTrainingplanIdByClientID/' + id, {
        headers: {
          'x-access-token': GetToken()
        }
      })
      .then((response) => {
        setUserTrainingplan(response.data.data[0])
      })

    axios
      .get('/api/UserWorkouts', {
        headers: {
          'x-access-token': GetToken()
        }
      })
      .then((response) => {
        setEventList(response.data.data)
      })
  }, [added])

  // Functions
  function handleButton() {
    const data = {
      training_plan_id: userTrainingplan.id,
      workout_id: selectedWorkoutID,
      date: selectedDay.year + '-' + selectedDay.month + '-' + selectedDay.day,
      is_done: 0
    }
    console.log(userTrainingplan)
    console.log(data)
    axios.post('api/AddWorkOutToUser', data).then(() => hasAdded(!added))
  }

  function OpenLink(link) {
    window.open(link)
  }

  function handleDropdownSelect(workoutId, workoutName) {
    setSelectedWorkoutID(workoutId)
    setSelectedWorkoutName(workoutName)
  }

  // Calendar variables and functions
  const defaultSelectedDay = {
    day: moment().date(),
    month: moment().month(),
    year: moment().year()
  }
  const [selectedDay, setSelected] = useState(defaultSelectedDay)

  /* CALENDAR HEAD */
  const allMonths = moment.months()
  const currentMonth = () => dateObject.format('MMMM')
  const currentYear = () => dateObject.format('YYYY')

  const setMonth = (month) => {
    const monthNo = allMonths.indexOf(month)
    let newDateObject = Object.assign({}, dateObject)
    newDateObject = moment(dateObject).set('month', monthNo)
    setdateObject(newDateObject)
    setShowMonthTable(false)
  }

  const toggleMonthSelect = () => setShowMonthTable(!showMonthTable)
  /** * CALENDAR BODY ***/
  const setSelectedDay = (day) => {
    setSelected({
      day,
      month: currentMonthNum(),
      year: currentYearNum()
    })
    hasSelected(true)
  }

  const currentMonthNum = () => dateObject.month() + 1
  const currentYearNum = () => dateObject.year()
  const daysInMonth = () => dateObject.daysInMonth()
  const currentDay = () => moment().date()
  const actualYear = () => moment().format('YYYY')
  const actualMonthNum = () => moment().month() + 1

  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)

  const firstDayOfMonth = () => moment(dateObject).startOf('month').format('d')
  const ActiveDates = []
  for (const workout of eventList) {
    ActiveDates.push({
      date: workout.date,
      id: workout.id,
      is_done: workout.is_done
    })
  }
  console.log(ActiveDates)

  return (
    <div className='calend'>
      <Container disableGutters='false'>
        <Grid container>
          <Grid item xs={8} md={20} lg={30}>
            <CalendarHead
              allMonths={allMonths}
              currentMonth={currentMonth}
              currentYear={currentYear}
              setMonth={setMonth}
              showMonthTable={showMonthTable}
              toggleMonthSelect={toggleMonthSelect}
            />
            {!showMonthTable
              ? (
                <CalendarBody
                  firstDayOfMonth={firstDayOfMonth}
                  daysInMonth={daysInMonth}
                  currentDay={currentDay}
                  currentMonth={currentMonth}
                  currentMonthNum={currentMonthNum}
                  currentYear={currentYear}
                  currentYearNum={currentYearNum}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  SelectedEvent={selectedEvent}
                  setSelectedEvent={setSelectedEvent}
                  actualMonthNum={actualMonthNum}
                  actualYear={actualYear}
                  weekdays={weekdays}
                  ActiveDates={ActiveDates}
                  SelectedUserID={id}
                  setSelectedWorkoutExercises={setSelectedWorkoutExercises}
                  setWorkoutListDropdown={setWorkoutListDropdown}
                  toggleModal={toggleModal}
                  added={added}
                />
              )
              : null}
            {selected
              ? (
                <div>
                  <div class='calendButtons'>
                    <FormGroup>
                      <Dropdown
                        group
                        isOpen={dropdownOpenWorkouts}
                        toggle={toggleWorkouts}
                      >
                        <DropdownToggle caret>
                          {selectedWorkoutName}
                        </DropdownToggle>
                        <DropdownMenu
                          modifiers={{
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
                          {workoutListDropdown.map((workout) => (
                            <DropdownItem
                              onClick={() =>
                                handleDropdownSelect(workout.id, workout.name)}
                            >
                              {workout.name}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                    <FormGroup>
                      <Button
                        color='primary'
                        onClick={() => handleButton()}
                        type='submit'
                      >
                        Add workout
                      </Button>
                    </FormGroup>
                  </div>

                  <Modal isOpen={modal} toggle={toggleModal}>
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
                      <StartWorkout
                        exerciseList={selectedWorkoutExercises} />

                      <WorkoutReport
                        toggleModal={toggleModal}
                        selectedEvent={selectedEvent.id}
                        added={added}
                        hasAdded={hasAdded}
                      />
                    </ModalFooter>
                  </Modal>
                </div>
              )
              : null}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Calendar
