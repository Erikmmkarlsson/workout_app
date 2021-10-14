import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'
import { GetToken, GetID } from '../../auth'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CalendarBody from '../CalendarBody'
import CalendarHead from '../CalendarHead'
import CalendButtons from '../CalendButtons'
import '../calendar.css'
import EventModal from './eventModal'

function Calendar(props) {

  // ** States and constants

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

  //Selected day
  const defaultSelectedDay = {
    day: moment().date(),
    month: moment().month(),
    year: moment().year()
  }
  const [selectedDay, setSelected] = useState(defaultSelectedDay)
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

            {/* if you show the month selector table,
             don't display the CalendarBody at the same time. */}
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

            {/* if you've selected a date, and there's no current event
             don't display the buttons to add a workout. */}
            {(selected && selectedEvent === undefined)
              ? (
                <CalendButtons
                  dropdownOpenWorkouts={dropdownOpenWorkouts}
                  toggleWorkouts={toggleWorkouts}
                  selectedWorkoutName={selectedWorkoutName}
                  workoutListDropdown={workoutListDropdown}
                  handleDropdownSelect={handleDropdownSelect}
                  handleButton={handleButton}
                />
              )
              : null}

            {/*If what you've selected has an event, display
              the event modal. */}
            {(selected && selectedEvent !== undefined) ? (
              <EventModal
                modal={modal}
                toggleModal={toggleModal}
                selectedWorkoutExercises={selectedWorkoutExercises}
                OpenLink={OpenLink}
                selectedEvent={selectedEvent}
                added={added}
                hasAdded={hasAdded}
              />
            ) : null}

          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Calendar

