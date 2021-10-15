import React from 'react'
import './calendar.css'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const CalendarHead = props => {
  const { allMonths, setMonth, toggleMonthSelect, currentMonth, currentYear, showMonthTable } = props

  const months = []

  allMonths.map(month => (
    months.push(
      <TableCell
        colSpan='2'
        className='month-cell'
        style={{ textAlign: 'center' }}
        key={month}
        onClick={e => setMonth(month)}
      >
        <span>{month}</span>
      </TableCell>
    )
  ))

  const rows = []
  let cells = []

  months.forEach((month, i) => {
    if (i % 3 !== 0 || i === 0) {
      cells.push(month)
    } else {
      rows.push(cells)
      cells = []
      cells.push(month)
    }
  })
  rows.push(cells)

  const monthList = rows.map((row, i) => <TableRow key={i}>{row}</TableRow>)

  return (
    <TableContainer component={Paper} className='month-selector'>
      
      <Table>
      
      
        <TableHead>
          <TableRow>
            <TableCell
              className='toggle-month'
              colSpan='4'
              onClick={() => toggleMonthSelect()}
            >
              {currentMonth()}
              <ArrowDropDownIcon
                className='arrow-icon'
              />
            </TableCell>
            <TableCell colSpan='4'>
              {currentYear()}
            </TableCell>
          </TableRow>
          
        </TableHead>
        
        {showMonthTable
          ? <TableBody>
            
            <TableRow>
              
              <TableCell
                colSpan='5'
                style={{ textAlign: 'center' }}
                className='select-month-title'
              >Select a month
              </TableCell>
            </TableRow>
            {monthList}
            </TableBody>
            
          : null}
      </Table>
      <div class="popup" onclick="myFunction()">
      <details>
      <span class="dott" ></span>
        <summary>Workouts status:</summary>
        
                    <span class="dot1" ></span>
                    <label > completed &nbsp;&nbsp;</label>
                    <span class="dot2"></span>
                    <label>&nbsp;planned   &nbsp;&nbsp;</label>
                    <span class="dot"></span>
                    <label>&nbsp;incompleted &nbsp;&nbsp; </label>
                    <span class="dot3"></span>
                    <label>&nbsp;missed  </label>
                    <span class="popuptext" id="myPopup"></span></details>
                    </div>
      
      
    </TableContainer>
    
  )

  
}


export default CalendarHead
