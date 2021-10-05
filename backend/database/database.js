const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = './backend/database/sqlite.db'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')

    db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            role text DEFAULT client,
            manager text,
            activated boolean DEFAULT false,
            CONSTRAINT email_unique UNIQUE (email)

            )`,
    (err) => {
      if (err) {
        // Table already created

      } else {
        // Table just created, creating some rows
        const insert_user = 'INSERT INTO users (name, email, password, manager, role, activated) VALUES (?,?,?,?,?,?)'
        db.run(insert_user, ['Jennifer Renoux', 'manager1@example.com', md5('admin123456'), null, 'manager', true])
        db.run(insert_user, ['Stewart Little', 'manager2@example.com', md5('user123456'), null, 'manager', true])
        db.run(insert_user, ['Erik', 'Erik@example.com', md5('user123456'), 1, 'client', true])
      }
    })
    db.run(`CREATE TABLE exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            description text,
            video_link text,
            last_updated smalldatetime
            )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert_exercise = 'INSERT INTO exercises (name, description, video_link) VALUES (?,?,?)'
        db.run(insert_exercise, ['Squats', 'Bend your legs, push up your body. Make sure to keep your core and hips active.', 'https://www.youtube.com/watch?v=aclHkVaku9U&ab_channel=Bowflex'])
        db.run(insert_exercise, ['Push ups', 'Stand on all four with your body straight. Push up your body using your arms, your core should stay active.', 'https://www.youtube.com/watch?v=Pkj8LLRsoDw&ab_channel=Bowflex'])
        db.run(insert_exercise, ['Deadlifts', 'Pick up a heavy object and lift it using your legs and back.', 'youtube.com/watch?v=IiGk8g3e41w&ab_channel=Bowflex'])
        db.run(insert_exercise, ['Bench press', 'Push up a heavy object while laying on a bench on your back.', 'youtube.com/watch?v=rT7DgCr-3pg&ab_channel=ScottHermanFitness'])
        db.run(insert_exercise, ['Jumping jacks', 'Stand up, jump and spread your legs and arms. Jump back. Repeat.', 'youtube.com/watch?v=1b98WrRrmUs&ab_channel=WahooFitness'])
        db.run(insert_exercise, ['Mountain climber', 'Stand on all four and walk on the spot with your legs.', 'youtube.com/watch?v=nmwgirgXLYM&ab_channel=Howcast'])
      }
    })
    db.run(`CREATE TABLE workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            creator INTEGER,
            FOREIGN KEY (creator) REFERENCES user(id)
            )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert_workout = 'INSERT INTO workouts (name, creator) VALUES (?, ?)'
        db.run(insert_workout, ['Power', 1])
        db.run(insert_workout, ['Cardio', 1])
        db.run(insert_workout, ['5-minute workout', 2])
        db.run(insert_workout, ['Back', 1])
        db.run(insert_workout, ['Full body workout', 2])
        db.run(insert_workout, ['Breast/Triceps', 1])
      }
    })

    db.run(`CREATE TABLE workout_exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER,
            exercise_id INTEGER,
            num_sets INTEGER,
            num_reps INTEGER,
            num_seconds INTEGER,
            comment text,
            FOREIGN KEY (workout_id) REFERENCES workouts(id),
            FOREIGN KEY (exercise_id) REFERENCES exercise(id)
            )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert_exercise = 'INSERT INTO workout_exercises (workout_id, exercise_id, num_sets, num_reps, num_seconds, comment) VALUES (?,?,?,?,?,?)'
        db.run(insert_exercise, [1, 1, 3, 12, null, ''])
        db.run(insert_exercise, [1, 3, 3, 8, null, ''])
        db.run(insert_exercise, [2, 5, 3, null, 120, ''])
        db.run(insert_exercise, [2, 6, 3, null, 60, ''])
        db.run(insert_exercise, [3, 2, null, null, 120, ''])
        db.run(insert_exercise, [3, 5, null, null, 120, ''])
        db.run(insert_exercise, [3, 6, null, null, 60, ''])
        db.run(insert_exercise, [4, 1, 3, 10, null, ''])
        db.run(insert_exercise, [4, 3, 3, 10, null, ''])
        db.run(insert_exercise, [5, 1, 3, 10, 0, ''])
        db.run(insert_exercise, [5, 2, 3, 10, 0, ''])
        db.run(insert_exercise, [5, 3, 3, 10, 0, ''])
        db.run(insert_exercise, [5, 5, 3, 10, 0, ''])
        db.run(insert_exercise, [6, 2, 3, 8, 0, ''])
        db.run(insert_exercise, [6, 4, 3, 8, 0, 'As heavy as you can.'])
      }
    }
    )

    db.run(`CREATE TABLE training_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER UNIQUE,
            manager_id INTEGER,
            FOREIGN KEY (client_id) REFERENCES user(id),
            FOREIGN KEY (manager_id) REFERENCES user(id),
            CONSTRAINT client_unique UNIQUE (client_id)
            )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert_training_plan = 'INSERT INTO training_plans (client_id, manager_id) VALUES (?,?)'
        db.run(insert_training_plan, [1, 2])
        db.run(insert_training_plan, [2, 1])
      }
    })
    db.run(`CREATE TABLE workout_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            training_plan_id INTEGER,
            workout_id INTEGER,
            date DATE,
            is_done BOOLEAN,
            manager_comment text,
            client_comment text,
            FOREIGN KEY (training_plan_id) REFERENCES training_plans(id),
            FOREIGN KEY (workout_id) REFERENCES workouts(id)
            )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert_workout_event = 'INSERT INTO workout_events (training_plan_id, workout_id, date, is_done, manager_comment, client_comment) VALUES (?,?,?,?,?,?)'
        db.run(insert_workout_event, [1, 1, null, 0, '', ''])
        db.run(insert_workout_event, [1, 2, null, 0, '', ''])
      }
    })
  }
})

module.exports = db
