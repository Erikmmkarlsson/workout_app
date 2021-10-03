import React, { useState } from 'react'
import moment from 'moment'

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
    const [selected, hasSelected] = useState(true)

    const defaultSelectedDay = {
        day: moment().date(),
        month: moment().month()
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
            month: currentMonthNum()
        })
        // Later refresh data
        hasSelected(true)
    }

    const currentMonthNum = () => dateObject.month()
    const daysInMonth = () => dateObject.daysInMonth()
    const currentDay = () => moment().date()
    const actualMonth = () => moment().format('MMMM')

    const firstDayOfMonth = () => moment(dateObject).startOf('month').format('d')
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
                        <CalendarBody
                            firstDayOfMonth={firstDayOfMonth}
                            daysInMonth={daysInMonth}
                            currentDay={currentDay}
                            currentMonth={currentMonth}
                            currentMonthNum={currentMonthNum}
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            actualMonth={actualMonth}
                            weekdays={weekdays}
                        />

                    </Grid>
                </Grid>
            </Container>

            <Container>
                {selected ? (
                    <div>
                        Selected day: {selectedDay.day}</div>
                ) : (null)}
            </Container>

        </div>
    )
};

export default Calendar
