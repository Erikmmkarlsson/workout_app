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
    Table,
    Button,
    FormGroup

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
    const [dropdownOpenWorkouts, setDropdownOpenWorkouts] = useState(false);
    const toggleWorkouts = () => setDropdownOpenWorkouts(prevState => !prevState);
    const [WorkoutList, setWorkoutList] = useState([])
    const [SelectedUserName, setSelectedUserName] = useState('')
    const [SelectedUserID, setSelectedUserID] = useState('')
    const [SelectedWorkoutExercises, setSelectedWorkoutExercises] = useState([])
    const [WorkoutListDropdown, setWorkoutListDropdown] = useState([])
    const [SelectedWorkoutID, setSelectedWorkoutID] = useState('')
    const [SelectedWorkoutName, setSelectedWorkoutName] = useState('Select a Workout')
    const [SelectedUserTrainingplanID, setSelectedUserTrainingplanID] = useState([])

    useEffect(() => {
        axios.get('/api/manager/myUsers',{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setUsersList(response.data.data)
        })
        
    }, [])

    const TrainingplanID=[]
    for (const ID of SelectedUserTrainingplanID){
        TrainingplanID.push(ID.id)
    }

    function handleButton(){
        const data = { training_plan_id:TrainingplanID,workout_id:SelectedWorkoutID,date:selectedDay.year+'-'+selectedDay.month+'-'+selectedDay.day,is_done: 0 }
        axios.post('api/AddWorkOutToUser',data)
        
        hasAdded(!added)
    }
    
    
    function handleSelect(selectedID,selectedName){
        setSelectedUserName(selectedName)
        setSelectedUserID(selectedID)
        axios.get('/api/GetTrainingplanIdByClientID/'+ selectedID,{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setSelectedUserTrainingplanID(response.data.data)
        })
        axios.get('/api/UserWorkoutsByInput/'+ selectedID,{
            headers: {
              'x-access-token': GetToken()
            }
          })
          .then((response) => {setWorkoutList(response.data.data)
        })

        console.log('tesst'+TrainingplanID)
    }

    const [added, hasAdded] = useState(false)
    useEffect(() => {
        handleSelect(SelectedUserID, SelectedUserName)
    }, [added])


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

    function OpenLink(link){
        window.open(link);
    }

    function handleDropdownSelect(WorkoutId,WorkoutName){
        setSelectedWorkoutID(WorkoutId)
        setSelectedWorkoutName(WorkoutName)


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
                        {SelectedUserName}
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
                                SelectedUserID={SelectedUserID}
                                setSelectedWorkoutExercises={setSelectedWorkoutExercises}
                                setWorkoutListDropdown={setWorkoutListDropdown}
                                added={added}
                            />
                        ) : null}
                        {selected ? (
                            <div>
                            <div class='buttons'>
                                <FormGroup>
                                    <Dropdown group isOpen={dropdownOpenWorkouts} toggle={toggleWorkouts}>
                                    <DropdownToggle color="info" caret >
                                    {SelectedWorkoutName}
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
                                                maxHeight: '100px',
                                                },
                                            };
                                            },
                                        },
                                        }}>
                                    {WorkoutListDropdown.map(Workout => <DropdownItem   onClick={()=>handleDropdownSelect(Workout.id,Workout.name)}>{Workout.name}</DropdownItem>)}
                                    </DropdownMenu>
                                    </Dropdown>
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                    color="success"
                                    onClick={()=>handleButton()}
                                    type='submit'
                                    >Add workout
                                    </Button>
                                </FormGroup>
                            </div>
                            <Table  hover style={{ background: 'white',marginTop: "1rem", width: "100%" }}>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>Sets</th>
                                    <th>reps</th>
                                    <th>Video</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SelectedWorkoutExercises.map(workout =>
                                    <tr>
                                        <td >{workout.name}</td>
                                        <td>{workout.num_sets}</td>
                                        <td>{workout.num_reps}</td>
                                        <td>
                                         <Button color="primary" onClick={()=> OpenLink(workout.video_link)}>Video</Button>
                                        </td>
                                        
                                    </tr>)}

                                </tbody>
                            </Table>
                            </div>
                        ) : (null)}

                    </Grid>
                </Grid>
            </Container>


        </div>
    )
};

export default Calendar
