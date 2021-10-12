import React, { useEffect } from 'react'
import './calendar.css'
import nextId from 'react-id-generator'
import axios from 'axios'
import { GetToken } from "../auth"

import moment from 'moment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'


const CalendarBody = props => {
    const { setSelectedEvent, toggleModal, added, firstDayOfMonth, daysInMonth, currentDay, currentMonth, currentYear, currentMonthNum, currentYearNum, selectedDay, setSelectedDay, actualMonth, actualYear, weekdays, ActiveDates, SelectedUserID, setSelectedWorkoutExercises, setWorkoutListDropdown } = props

    const blanks = []
    for (let i = 1; i < firstDayOfMonth(); i++) {
        blanks.push(
            <TableCell key={nextId()} />
        )
    }
    useEffect(() => {
        //console.log('/api/UserWorkoutsExercises/'+SelectedUserID+'/'+selectedDay.year+'-'+(selectedDay.month)+'-'+selectedDay.day)
        axios.get('/api/UserWorkoutsExercises/' + SelectedUserID + '/' + selectedDay.year + '-' + (selectedDay.month) + '-' + selectedDay.day, {
            headers: {
                'x-access-token': GetToken()
            }
        })
            .then((response) => {
                setSelectedWorkoutExercises(response.data.data)
            })


        axios.get('/api/GetUser&UserManagerWorkouts/' + SelectedUserID, {
            headers: {
                'x-access-token': GetToken()
            }
        })
            .then((response) => {
                setWorkoutListDropdown(response.data.data)
            })



    }, [selectedDay, added])

    const monthDays = []
    console.log(ActiveDates)
    for (let d = 1; d <= daysInMonth(); d++) {
        let currDay, selectDay, activeDay, selectEvent

        for (const Date in ActiveDates) {
            if (moment(ActiveDates[Date].date).date() === d
                && moment(ActiveDates[Date].date).month() + 1 === currentMonthNum()
                && moment(ActiveDates[Date].date).year() === currentYearNum()) { 
                
                    selectEvent = {id:ActiveDates[Date].id, is_done: ActiveDates[Date].is_done}
                    console.log(selectEvent)
                    if(currentYear() < actualYear()){
                        if(ActiveDates[Date].is_done === 2){
                            activeDay = 'missed'
                        }
                        else if(ActiveDates[Date].is_done === 1){
                            activeDay = 'done'
                        }
                        else{
                            activeDay = 'waiting'
                        }
                    }

                    else if((currentMonth() < actualMonth()) && (currentYear() === actualYear())){
                        if(ActiveDates[Date].is_done === 2){
                            activeDay = 'missed'
                        }
                        else if(ActiveDates[Date].is_done === 1){
                            activeDay = 'done'
                        }
                        else{
                            activeDay = 'waiting'
                        }
                    }

                    else if((d < currentDay()) && (currentMonth() === actualMonth()) && (currentYear() === actualYear()) ){
                        if(ActiveDates[Date].is_done === 2){
                            activeDay = 'missed'
                        }
                        else if(ActiveDates[Date].is_done === 1){
                            activeDay = 'done'
                        }
                        else{
                            activeDay = 'waiting'
                        }
                    }
                    else{
                        activeDay = 'active'
                    }
                }
        }

        // Check if day is today
        if (currentDay() === d && currentMonth() === actualMonth() && currentYear() === actualYear()) currDay = 'today'

        // Check if day is selected day
        if (selectedDay !== undefined) {
            if (selectedDay.day === d && currentMonthNum() === selectedDay.month) { selectDay = 'selected-day' }
        }
        monthDays.push(
            <TableCell
                key={d}
                className={`week-day ${currDay} ${selectDay}`}
                onClick={() => {
                    setSelectedDay(d)
                    if(selectEvent !== undefined){
                        setSelectedEvent(selectEvent)
                    }
                    
                    if (activeDay !== undefined) {
                        toggleModal()
                    }
                }}
            >
                {d > 9 ? (<span className={activeDay}>{d}</span>)
                    : (<span className={activeDay}>&nbsp;{d}&nbsp;</span>)}
            </TableCell>
        )
    }

    const totalSlots = [...blanks, ...monthDays]
    const rows = []
    let cells = []

    totalSlots.forEach((row, i) => {
        if (i % 7 !== 0) {
            cells.push(row)
        } else {
            rows.push(cells)
            cells = []
            cells.push(row)
        }
        if (i === totalSlots.length - 1) {
            rows.push(cells)
        }
    })

    return (
        <TableContainer component={Paper}>
            <Table className='calendar'>
                <TableHead>
                    <TableRow>
                        {
                            weekdays.map((day, i) => (
                                <TableCell key={i}>
                                    {day}
                                </TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows.map((day, i) =>
                            <TableRow
                                key={i}
                            >
                                {day}
                            </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CalendarBody
