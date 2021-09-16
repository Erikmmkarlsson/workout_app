// Create express app
var express = require("express")
var app = express()
var db = require("./database/database.js")
var md5 = require("md5")
var cors = require('cors')
app.use(cors())

app.use(express.urlencoded({}));
  app.use(express.json());


// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

app.get("/api/users", (req, res, next) => {
   /*
Returns all the users.

Example usage:
 $ curl http://localhost:5000/api/users -X GET 
  */
 console.log("Returning all users...");

  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/user/:id", (req, res, next) => {

    /*
Returns a specific user
Example usage:
 $ curl http://localhost:5000/api/user/5 -X GET 
  */
 console.log("Returning one user...");

  var sql = "select * from user where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});


app.post("/api/user/", (req, res, next) => {
  /*
Posts a new user, for example a newly created user. 

Example usage:
 $ curl http://localhost:5000/api/user -X POST \
         -H "Authorization: Bearer <your_token>" \
             -d '
             {
                "name": "erik33", 
                "email": "workoutapp",
                "password": "t3r23",
             }'

  */
 console.log("Creating a new user...");
  var errors=[]
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password) //md5 hashes the password
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})