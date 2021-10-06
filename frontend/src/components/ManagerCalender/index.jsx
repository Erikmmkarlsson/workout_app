import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from 'axios'
import  {GetToken} from "../auth"
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import CalendarBody from './CalendarBody'
import CalendarHead from './CalendarHead'
import{

    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,

} from 'reactstrap';
function Calendar(props) {
    
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    /* HOOKS */
    // Later add hook for active days from database
    const [dateObject, setdateObject] = useState(moment())
    const [showMonthTable, setShowMonthTable] = useState(false)
    const [selected, hasSelected] = useState(false)
    const [UsersList, setUsersList] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const [WorkoutList, setWorkoutList] = useState([])
    const [SelectedUser, setSelectedUser] = useState('')
    
    

    useEffect(() => {
        axios.get('/api/manager/myUsers',{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setUsersList(response.data.data)
        })
    }, [])
    
    function handleSelect(selectedID,selectedName){
        setSelectedUser(selectedName)
        
        axios.get('/api/UserWorkoutsByInput/'+ selectedID,{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setWorkoutList(response.data.data)
        })
    }



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
    const ActiveDates = []
    for (const workout of WorkoutList){
        ActiveDates.push(workout.date)
    }
    return (
        <div className='calend'>
            <Container disableGutters='false'>

                <Grid container>
                        <Grid item xs={8} md={20} lg={30}>
                        <Dropdown style={{ marginTop: "1rem", width: "100%" }} group isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret style={{ marginTop: "1rem", width: "100%" }}>
                        {SelectedUser}
                        </DropdownToggle>
                        <DropdownMenu style={{ marginTop: "1rem", width: "100%" }}>
                        {UsersList.map(User => <DropdownItem   onClick={()=>handleSelect(User.id,User.name)}>{User.name}</DropdownItem>)}
                        </DropdownMenu>
                        </Dropdown>
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
                                currentYearNum={currentYearNum}
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                actualMonth={actualMonth}
                                actualYear={actualYear}
                                weekdays={weekdays}
                                ActiveDates={ActiveDates}

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
