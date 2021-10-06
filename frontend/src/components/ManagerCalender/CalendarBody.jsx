import React from 'react'
import './calendar.css'
import nextId from 'react-id-generator'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'


const CalendarBody = props => {
    const { firstDayOfMonth, daysInMonth, currentDay, currentMonth,currentYear, currentMonthNum, selectedDay, setSelectedDay, actualMonth, actualYear, weekdays,ActiveDays } = props

    const blanks = []
    for (let i = 1; i < firstDayOfMonth(); i++) {
        blanks.push(
            <TableCell key={nextId()} />
        )
    }

    console.log(ActiveDays)
    const monthDays = []
    for (let d = 1; d <= daysInMonth(); d++) {
        let currDay, selectDay, activeDay

        for(const Day in ActiveDays){
            console.log(Day)
            if( ActiveDays[Day] === d && currentMonth() === actualMonth() && currentYear() === actualYear()){activeDay= 'active'}
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
                className={`week-day ${currDay} ${selectDay} ${activeDay}`}
                onClick={() => {
                    setSelectedDay(d)
                }}
            >
                <span className={activeDay}>{d}</span>
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
