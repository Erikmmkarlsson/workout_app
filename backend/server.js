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
var onlyManager = require("./auth/onlyManager.js")

//Specify functionality to be used
app.use(cors())
app.use(express.json());

// Start server
var HTTP_PORT = process.env.HTTP_PORT;
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});


/*
API Endpoints
*/

app.get("/api/user", onlyManager, (req, res, next) => {
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
    Returns all the managers.
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

app.patch("/api/user/:id", (req, res, next) => {
 
    console.log("Updating user...");
    var data = {
        activated: req.body.activated,
    }
    var sql = "UPDATE user set activated = COALESCE(?,activated)  WHERE id = ?"
    var params = [data.activated, req.params.id]
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
        manager: req.body.manager,
        role: req.body.role,
    }
    var sql ='INSERT INTO user (name, email, password,manager,role) VALUES (?,?,?,?,?)'
    var params =[data.name, data.email, data.password, data.manager, data.role]
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
                    { user_id: user.id, email,
                        user_role: user.role },
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

/* 

Methods for fetching and creating exercises

*/
function GetID(req){
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    console.log(decoded.user_role);
    return decoded.user_id
}

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

/* 

Methods for fetching and creating workouts

*/

app.get("/api/workouts/", (req, res, next) => {
    /*
    Returns all the workouts.
    Example usage:
  $ curl http://localhost:8000/api/workouts -X GET 
   */
    console.log("Returning all workouts...");
    var sql = "select * from workouts";
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

app.get("/api/workouts/:id", (req, res, next) => {

    /*
    Returns a specific workout
    Example usage:
 $ curl http://localhost:8000/api/workouts/5 -X GET 
  */
    console.log("Returning one workout...");

    var sql = "select * from workouts where id = ?"
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

app.post("/api/workouts/", (req, res, next) => {
    /*
    Posts a new workout to be added to the db, for example a newly created workout. 
  
    Example usage:
    $ curl http://localhost:8000/api/workouts -X POST \
               -d '
               {
                  "name": "sit ups", 
                  "description": "sit and raise your upper body",
                  "video_link": "youtube.com",
               }'
  
    */
    console.log("Creating a new workout...");
    console.log("Client_id: " + req.body.client_id);
    var errors = []
    if (!req.body.client_id) {
        console.log("Error 1");
        errors.push("No client specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        client_id: req.body.client_id,
        is_done: req.body.is_done,
        comment: req.body.comment
    }
    var sql = 'INSERT INTO workouts (client_id, is_done, comment) VALUES (?,?,?)'
    var params = [data.client_id, data.is_done, data.comment]
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

app.delete("/api/workouts/:id", (req, res, next) => {
    /*

    Deletes a workout from the db 
  
    */    
    console.log("Deleting workout...");

    var sql = "delete from workouts where id = ?"
    var params = [req.params.id]
    db.get(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

app.patch("/api/workouts/:id", (req, res, next) => {
    /*
    
    Modifies an existing workout in the db. 
  
    */     
    console.log("Updating workout...");
    var data = {
        client_id: req.body.client_id,
        is_done: req.body.is_done,
        comment: req.body.comment
    }
    var sql = "UPDATE workouts set client_id = COALESCE(?,client_id), is_done = COALESCE(?,is_done), comment = COALESCE(?,comment) WHERE id = ?"
    var params = [data.client_id, data.is_done, data.comment, req.params.id]
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

/* 

                // Create token
                const token = jwt.sign(
                    { user_id: user.id, email,
                        user_role: user.role },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                // save user token
                
                user.token = token;

*/

app.get("/api/workout_exercises/", (req, res, next) => {
    /*
    Returns all the workout_exercises.
    Example usage:
  $ curl http://localhost:8000/api/workout_exercises -X GET 
   */
    console.log("Returning all workout_exercises...");
    var sql = "select * from workout_exercises";
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

app.get("/api/workout_exercises/:id", (req, res, next) => {

    /*
    Returns a specific workout_exercise
    Example usage:
 $ curl http://localhost:8000/api/workout_exercises/5 -X GET 
  */
    console.log("Returning one workout_exercise...");

    var sql = "select * from workout_exercises where id = ?"
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

app.post("/api/workout_exercises/", (req, res, next) => {
    /*
    Posts a new workout_exercise to be added to the db. 
  
    Example usage:
    $ curl http://localhost:8000/api/workout_exercises -X POST \
               -d '
               {
                  "workout_id": 1, 
                  "exercise_id": 1,
                  "weight": 30,
                  "num_sets": 5,
                  "num_reps": 8,
                  "num_seconds": null,
                  "comment": "Activate your stomach"
               }'
  
    */
    console.log("Adding exercise to workout...");
    var errors = []
    if (!req.body.workout_id) {
        console.log("Error 1");
        errors.push("No workout specified");
    }
    if (!req.body.exercise_id) {
        console.log("Error 2");
        errors.push("No exercise specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        workout_id: req.body.workout_id,
        exercise_id: req.body.exercise_id,
        weight: req.body.weight,
        num_sets: req.body.num_sets,
        num_reps: req.body.num_reps,
        num_seconds: req.body.num_seconds,
        comment: req.body.comment
    }
    var sql = 'INSERT INTO workout_exercises (workout_id, exercise_id, weight, num_sets, num_reps, num_seconds, comment) VALUES (?,?,?,?,?,?,?)'
    var params = [data.workout_id, data.exercise_id, data.weight, data.num_sets, data.num_reps, data.num_seconds, data.comment]
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

app.delete("/api/workout_exercises/:id", (req, res, next) => {
    /*

    Deletes a workout_exercises from the db 
  
    */    
    console.log("Removing exercise from workout...");

    var sql = "delete from workout_exercises where id = ?"
    var params = [req.params.id]
    db.get(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

app.patch("/api/workout_exercises/:id", (req, res, next) => {
    /*
    
    Modifies an existing workout_exercise in the db. 
  
    */     
    console.log("Updating workout_exercise...");
    var data = {
        workout_id: req.body.workout_id,
        exercise_id: req.body.exercise_id,
        weight: req.body.weight,
        num_sets: req.body.num_sets,
        num_reps: req.body.num_reps,
        num_seconds: req.body.num_seconds,
        comment: req.body.comment
    }
    var sql = "UPDATE workout_exercises set workout_id = COALESCE(?,workout_id), exercise_id = COALESCE(?,exercise_id), weight = COALESCE(?,weight), num_sets = COALESCE(?,num_sets), num_reps = COALESCE(?,num_reps), num_seconds = COALESCE(?,num_seconds), comment = COALESCE(?,comment) WHERE id = ?"
    var params = [data.workout_id, data.exercise_id, data.weight, data.num_sets, data.num_reps, data.num_seconds, data.comment, req.params.id]
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

app.get("/api/manager/WaitingList",onlyManager,(req,res, next) => {
    

    const id = GetID(req)
    console.log(id);

    var sql = "select * from user where role='user' and activated=false and manager = ? "
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        console.log(rows);
        res.json({
            "message": "success",
            "data": rows
            
        })
    });
});
app.get("/api/manager/myUsers",onlyManager,(req,res, next) => {
    

    const id = GetID(req)
    console.log(id);

    var sql = "select * from user where role='user' and activated=true and manager = ? "
    var params = [id]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        console.log(rows);
        res.json({
            "message": "success",
            "data": rows
            
        })
    });
});



  
// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
