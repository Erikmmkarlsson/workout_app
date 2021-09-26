// Imports
var express = require("express")
var bodyParser = require('body-parser')
var {check, validationResult} = require('express-validator')
var app = express()
var db = require("./database/database.js")
var md5 = require("md5")
var cors = require('cors')
var jwt = require("jsonwebtoken")
require('dotenv').config()
var verifyToken =  require("./auth")

//Specify functionality to be used
app.use(cors())
app.use(express.json());
var HTTP_PORT = process.env.HTTP_PORT;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});


/*
API Endpoints
*/
app.get("/api/users", verifyToken, (req, res, next) => {
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
    console.log("Search is set to: ");
    console.log(req.query.search);
    var search = req.query.search;
    if(search==undefined){
        var sql = "select * from exercise";
    }
    else{
        var sql = `select * from exercise where name like '%${search}%'`
    }
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
                  "video_link": "youtube.com",
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
        description: req.body.description,
        video_link: req.body.video_link
    }
    var sql = 'INSERT INTO exercise (name, description, video_link, last_updated) VALUES (?,?,?,CURRENT_TIMESTAMP)'
    var params = [data.name, data.description, data.video_link]
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

app.delete("/api/exercises/:id", (req, res, next) => {
    /*

    Deletes an exercise from the db 
  
    */    
    console.log("Deleting exercise...");

    var sql = "delete from exercise where id = ?"
    var params = [req.params.id]
    db.get(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

app.patch("/api/exercises/:id", (req, res, next) => {
    /*
    
    Modifies an existing exercise in the db. 
  
    */     
    console.log("Updating exercise...");
    var data = {
        name: req.body.name,
        description: req.body.description,
        video_link: req.body.video_link
    }
    var sql = "UPDATE exercise set name = COALESCE(?,name), description = COALESCE(?,description), video_link = COALESCE(?,video_link), last_updated = CURRENT_TIMESTAMP WHERE id = ?"
    var params = [data.name, data.description, data.video_link, req.params.id]
    db.run(sql, params, function (err, row) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

app.post("/api/login", async (req, res) => {
    console.log("Login...")
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        var sql = "select * from user where email = ?"
        var params = [email]
        db.get(sql, params, (err, user) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }

            // If matching password
            if (md5(password) === user.password) {
                console.log("matching")
                // Create token
                const token = jwt.sign(
                    { user_id: user.id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                // save user token
                user.token = token;

                // user
                res.status(200).json(user);
            }else{
            res.status(400).send("Invalid Credentials");
            }
        }); 
    }
 catch (err) {
            console.log(err);
        }

        // Our register logic ends here

});


  
// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
