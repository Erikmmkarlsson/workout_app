var {check, validationResult} = require('express-validator')
var md5 = require("md5")

module.exports = function(app, db) {  //receiving "app" and "db" instance

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
            if (md5(password) === user.password && user.activated == true) {
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

app.post("/api/register/", [
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


}