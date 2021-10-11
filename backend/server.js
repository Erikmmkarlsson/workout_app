// Imports
const { check, validationResult } = require('express-validator')
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
require('./routes/workout_events')(app, db) 

require('./routes/friend')(app, db)

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
  
  const sql = "select * from users where activated=true and id != manager and manager = ? "
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


///MODIFY WHEN FRIENDS SYSTEM ADDED 
///MODIFY WHEN FRIENDS SYSTEM ADDED 
///MODIFY WHEN FRIENDS SYSTEM ADDED 
app.get('/api/user/user&friends', (req, res, next) => {
  const id = getID(req)
  console.log(id)
  
  const sql = "select * from users where activated=true and id = ? "
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

app.get('/api/UserWorkouts',(req, res, next) => {
  const id = getID(req)
  const sql = "select workout_events.date, workout_events.workout_id from training_plans Inner join workout_events on training_plans.id= workout_events.training_plan_id where training_plans.client_id = ?"
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
app.get('/api/UserWorkoutsByInput/:id',(req, res, next) => {
  const sql = "select workout_events.date, workout_events.workout_id from training_plans Inner join workout_events on training_plans.id= workout_events.training_plan_id where training_plans.client_id = ?"
  const params = [req.params.id]
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

app.get('/api/UserWorkoutsExercises/:id/:date',(req, res, next) => {
  const sql = 
  "select workouts.name,exercises.name,exercises.description,exercises.video_link, workout_exercises.num_sets, workout_exercises.num_reps, workout_exercises.num_seconds from training_plans Inner join workout_events on training_plans.id= workout_events.training_plan_id Inner join  workouts on workout_events.workout_id= workouts.id Inner join  workout_exercises on workout_events.workout_id= workout_exercises.workout_id Inner join  exercises on workout_exercises.exercise_id = exercises.id where training_plans.client_id = ? AND workout_events.date= ? "
  const params = [req.params.id,req.params.date]
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


app.get('/api/GetUser&UserManagerWorkouts/:id',(req, res, next) => {
  const sql = 
  "SELECT workouts.id,workouts.name from users Inner join workouts on users.id =workouts.creator where users.id= ? or users.id in ( select users.manager from users where users.id= ?)"
  const params = [req.params.id,req.params.id]
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


app.get('/api/GetTrainingplanIdByClientID/:id',(req, res, next) => {
  const sql = "select training_plans.id from training_plans where training_plans.client_id =?"
  const params = [req.params.id]
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



app.post('/api/AddWorkOutToUser/', (req, res, next) => {

  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const data = {
      training_plan_id: req.body.training_plan_id,
      workout_id: req.body.workout_id,
      date: req.body.date,
      is_done: req.body.is_done
    }
    const sql='INSERT INTO  workout_events (training_plan_id,workout_id,date,is_done) VALUES (?,?,?,?)'
    const params = [data.training_plan_id, data.workout_id, data.date, data.is_done]
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: data
      })
    })
  };
})







// Default response for any other request
app.use(function (req, res) {
  res.status(404)
})

module.exports = app
