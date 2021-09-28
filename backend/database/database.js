var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "./backend/database/sqlite.db"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')

        
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            role text DEFAULT "client",
            manager text,
            activated boolean DEFAULT false,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already created

                } else {
                    // Table just created, creating some rows
                    var insert_user = 'INSERT INTO user (name, email, password,manager,role, activated) VALUES (?,?,?,?,?,?)'
                    db.run(insert_user, ["manager1", "manager1@example.com", md5("admin123456"),null ,"manager", true] )
                    db.run(insert_user, ["manager2", "manager2@example.com", md5("user123456"),null ,"manager", true])
                    db.run(insert_user, ["Erik", "Erik@example.com", md5("user123456"),null,"user", true])

                }
            });
        db.run(`CREATE TABLE exercise (
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
                    var insert_exercise = 'INSERT INTO exercise (name, description, video_link, last_updated) VALUES (?,?,?,?)'
                    db.run(insert_exercise, ["squats", "bend your legs", "https://www.youtube.com/watch?v=aclHkVaku9U&ab_channel=Bowflex"])
                    db.run(insert_exercise, ["push ups", "push up your body", "https://www.youtube.com/watch?v=Pkj8LLRsoDw&ab_channel=Bowflex"])
                }
            });
        db.run(`CREATE TABLE workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER,
            is_done INTEGER,
            comment text,
            FOREIGN KEY (client_id) REFERENCES user(id)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert_exercise = 'INSERT INTO workouts (client_id, is_done, comment) VALUES (?,?,?)'
                    db.run(insert_exercise, [1, null, ""])
                    db.run(insert_exercise, [2, null, ""])
                }
            });
        db.run(`CREATE TABLE workout_exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER,
            exercise_id INTEGER,
            weight INTEGER,
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
                    var insert_exercise = 'INSERT INTO workout_exercises (workout_id, exercise_id, weight, num_sets, num_reps, num_seconds, comment) VALUES (?,?,?,?,?,?,?)'
                    db.run(insert_exercise, [1, 1, 5, 3, 10, 0, ""])
                    db.run(insert_exercise, [1, 3, 5, 3, 10, 0, ""])
                }
            });
    }
});

module.exports = db