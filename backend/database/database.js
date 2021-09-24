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
            activated boolean DEFAULT false,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already created

                } else {
                    // Table just created, creating some rows
                    var insert_user = 'INSERT INTO user (name, email, password,role) VALUES (?,?,?,?)'
                    db.run(insert_user, ["manager1", "manager1@example.com", md5("admin123456"), "manager"])
                    db.run(insert_user, ["manager2", "manager2@example.com", md5("user123456"), "manager"])
                    db.run(insert_user, ["Erik", "Erik@example.com", md5("user123456")])

                }
            });
        db.run(`CREATE TABLE exercise (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            description text,
            video_link text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert_exercise = 'INSERT INTO exercise (name, description, video_link) VALUES (?,?,?)'
                    db.run(insert_exercise, ["squats", "bend your legs", "https://www.youtube.com/watch?v=aclHkVaku9U&ab_channel=Bowflex"])
                    db.run(insert_exercise, ["push ups", "push up your body", "https://www.youtube.com/watch?v=Pkj8LLRsoDw&ab_channel=Bowflex"])
                }
            });
    }
});

module.exports = db