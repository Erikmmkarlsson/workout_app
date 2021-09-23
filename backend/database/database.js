var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "./backend/database/sqlite.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            role text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert_user = 'INSERT INTO user (name, email, password,role) VALUES (?,?,?,?)'
                db.run(insert_user, ["manager1","manager1@example.com",md5("admin123456"),"manager"])
                db.run(insert_user, ["manager2","manager2@example.com",md5("user123456"),"manager"])
            }
        });  
        db.run(`CREATE TABLE exercise (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            description text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert_exercise = 'INSERT INTO exercise (name, description) VALUES (?,?)'
                db.run(insert_exercise, ["squats","bend your legs"])
                db.run(insert_exercise, ["push ups","push up your body"])
            }
        });  
    }
});

module.exports = db