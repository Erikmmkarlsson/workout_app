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


app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { username, email, password, role } = req.body;
  
      // Validate user input
      if (!(email && password && username && role)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await users.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await users.create({
        username,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        role,
      });
  
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
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await users.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
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
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  
// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
