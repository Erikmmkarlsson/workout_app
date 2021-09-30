// Imports
var express = require("express")
var app = express()
var db = require("./database/database.js")
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

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 20
});

// apply rate limiter to all requests
app.use(limiter);


/*
API routes
*/
require('./routes/account')(app, db); //Sending "app" and "db" instance to account

require('./routes/exercises')(app, db); //Sending "app" and "db" instance to exercises
require('./routes/workouts')(app, db); //Sending "app" and "db" instance to workouts

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


/* 

Methods for fetching and deleting profile

*/
app.get("/api/users/:id", verifyToken, (req, res, next) => {

    /*
    Returns a specific user
    Example usage:
 $ curl http://localhost:8000/api/user/5 -X GET 
  */
    console.log("Returning one user...");

    var sql = "select * from user where id = ?"
    var params = [GetID(req)]
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

app.delete("/api/users/:id", (req, res, next) => {
    /*

    Deletes an user from the db 
  
    */    
    console.log("Deleting user...");

    var sql = "delete from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

app.patch("/api/users/:id", (req, res, next) => {
    /*
    
    Modifies an existing user in the db. 
  
    */     
    console.log("Updating user...");

    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    
    var sql = "UPDATE user set name = COALESCE(?,name), email = COALESCE(?,email), password = COALESCE(?,password), role = COALESCE(?,role) WHERE id = ?"
    var params = [data.name, data.email, data.password, data.role, req.params.id]
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

Methods for fetching password

*/

app.patch("/api/password/:id", (req, res, next) => {
    /*
    
    Modifies password for an existing user in the db. 
  
    */     
    console.log("Updating password...");

    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    }
    
    var sql = "UPDATE user set password = COALESCE(?,password) WHERE id = ?"
    var params = [data.password, req.params.id]
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
app.get("/api/manager/myUsers", onlyManager,(req,res, next) => {
    

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
