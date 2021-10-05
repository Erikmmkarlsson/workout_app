// Imports
const express = require('express')
const app = express()
const db = require('./database/database.js')
const cors = require('cors')
require('dotenv').config()
const onlyManager = require('./auth/onlyManager.js')

const getID = require('./auth/getID')

// Specify functionality to be used
app.use(cors())
app.use(express.json())

// set up rate limiter: maximum of 100 requests per minute
const RateLimit = require('express-rate-limit')
const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100
})

// apply rate limiter to all requests
app.use(limiter)

/*
API routes
*/
require('./routes/account')(app, db) // Sending "app" and "db" instance to account
require('./routes/profile')(app, db) 

require('./routes/exercises')(app, db) // Sending "app" and "db" instance to exercises
require('./routes/workouts')(app, db) // Sending "app" and "db" instance to workouts
require('./routes/training_plans')(app, db) 


require('./routes/users')(app, db) 

app.get('/api/managers', (req, res, next) => {
  /*
    Returns all the managers.
    Example usage:
  $ curl http://localhost:8000/api/users -X GET
   */
  console.log('Returning all managers...')

  const sql = "select * from users where role='manager'"
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

/*

Methods for fetching and creating exercises

*/




app.get('/api/manager/WaitingList', onlyManager, (req, res, next) => {
  const id = getID(req)
  console.log(id)

  const sql = "select * from users where activated=false and manager = ? "
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    console.log(rows)
    res.json({
      message: 'success',
      data: rows

    })
  })
})
app.get('/api/manager/myUsers', onlyManager, (req, res, next) => {
  const id = getID(req)
  console.log(id)

  const sql = "select * from users where activated=true and manager = ? "
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    console.log(rows)
    res.json({
      message: 'success',
      data: rows

    })
  })
})

// Default response for any other request
app.use(function (req, res) {
  res.status(404)
})

module.exports = app
