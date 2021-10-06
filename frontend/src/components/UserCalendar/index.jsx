import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'
import  {GetToken} from "../auth"
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CalendarBody from './CalendarBody'
import CalendarHead from './CalendarHead'

function Calendar(props) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    /* HOOKS */
    // Later add hook for active days from database
    const [dateObject, setdateObject] = useState(moment())
    const [showMonthTable, setShowMonthTable] = useState(false)
    const [selected, hasSelected] = useState(false)
    const [WorkoutList, setWorkoutList] = useState([])

    useEffect(() => {
        axios.get('/api/UserWorkouts',{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setWorkoutList(response.data.data)
        })
    }, [])
      console.log(WorkoutList[1])


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

    const setMonth = month => {
        const monthNo = allMonths.indexOf(month)
        let newDateObject = Object.assign({}, dateObject)
        newDateObject = moment(dateObject).set('month', monthNo)
        setdateObject(newDateObject)
        setShowMonthTable(false)
    }

    const toggleMonthSelect = () => setShowMonthTable(!showMonthTable)
    /** * CALENDAR BODY ***/
    const setSelectedDay = day => {

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
    const actualMonth = () => moment().format('MMMM')
    const actualYear = () => moment().format('YYYY')

    const firstDayOfMonth = () => moment(dateObject).startOf('month').format('d')
    const ActiveDays = new Array 
    for (const workout of WorkoutList){
        ActiveDays.push(moment(workout.date).date())
    }
    return (
        <div className='calend'>
            <Container disableGutters='false'>

                <Grid container>
                    <Grid item xs={12} md={6} lg={9}>
                        <CalendarHead
                            allMonths={allMonths}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                            setMonth={setMonth}
                            showMonthTable={showMonthTable}
                            toggleMonthSelect={toggleMonthSelect}
                        />
                        {!showMonthTable ? (
                            <CalendarBody
                                firstDayOfMonth={firstDayOfMonth}
                                daysInMonth={daysInMonth}
                                currentDay={currentDay}
                                currentMonth={currentMonth}
                                currentMonthNum={currentMonthNum}
                                currentYear={currentYear}
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                actualMonth={actualMonth}
                                actualYear={actualYear}
                                weekdays={weekdays}
                                ActiveDays={ActiveDays}
                            />
                        ) : null}

                    </Grid>
                </Grid>
            </Container>

            <Container>
                {selected ? (
                    <div style={{ textAlign: "center" }}>
                        <br />
                        <p>    Selected day: {selectedDay.day}</p>
                        <p>  Month: {selectedDay.month} </p>
                        <p>  Year: {selectedDay.year} </p>
                    </div>
                ) : (null)}
            </Container>

        </div>
    )
};

export default Calendar
