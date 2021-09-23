// Create express app
var express = require("express")
var bodyParser = require('body-parser')
var {check, validationResult} = require('express-validator')
var app = express()
var db = require("./database/database.js")
var md5 = require("md5")
var cors = require('cors')


app.use(cors())

app.use(express.urlencoded());

app.use(express.json());


// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});


app.get("/api/users", (req, res, next) => {
    /*
    Returns all the users.
    Example usage:
  $ curl http://localhost:8000/api/users -X GET 
   */
    console.log("Returning all users...");

    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.get("/api/managers", (req, res, next) => {
    /*
    Returns all the users.
    Example usage:
  $ curl http://localhost:8000/api/users -X GET 
   */
    console.log("Returning all managers...");

    var sql = "select * from user where role='manager'"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.get("/api/user/:id", (req, res, next) => {

    /*
    Returns a specific user
    Example usage:
 $ curl http://localhost:8000/api/user/5 -X GET 
  */
    console.log("Returning one user...");

    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});



const urlencodedParser = bodyParser.urlencoded({extended: false})
app.post("/api/user/",urlencodedParser, [
    check('name', 'The username must be 3+ characters long')
       .exists()
       .isLength({min:3}),
    
    check('email','Email is not valid')
       .isEmail()
       .normalizeEmail()

], (req, res, next) => {
  
  const errors = validationResult(req)
  if(errors.isEmpty())
  {
    console.log("Creating a new user...");    
    var data = {
        name: req.body.name,
        email: req.body.email,
        password : md5(req.body.password), //md5 hashes the password
        role: req.body.role,
    }
    var sql ='INSERT INTO user (name, email, password,role) VALUES (?,?,?,?)'
    var params =[data.name, data.email, data.password, data.role]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
   })};
});


/* 

Methods for fetching and creating exercises

*/


app.get("/api/exercises/", (req, res, next) => {
    /*
    Returns all the exercises.
    Example usage:
  $ curl http://localhost:8000/api/exercises -X GET 
   */
    console.log("Returning all exercises...");

    var sql = "select * from exercise"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.get("/api/exercises/:id", (req, res, next) => {

    /*
    Returns a specific exercise
    Example usage:
 $ curl http://localhost:8000/api/exercise/5 -X GET 
  */
    console.log("Returning one exercise...");

    var sql = "select * from exercise where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});


app.post("/api/exercises/", (req, res, next) => {
    /*
    Posts a new exercise to be added to the db, for example a newly created exercise. 
  
    Example usage:
    $ curl http://localhost:8000/api/exercises -X POST \
               -d '
               {
                  "name": "sit ups", 
                  "description": "sit and raise your upper body",
               }'
  
    */
    console.log("Creating a new exercise...");
    var errors = []
    if (!req.body.description) {
        errors.push("No description specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        description: req.body.description
    }
    var sql = 'INSERT INTO exercise (name, description) VALUES (?,?)'
    var params = [data.name, data.description]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data
        })
    });
});



// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
