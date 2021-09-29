
module.exports = function (app, db) {  //receiving "app" and "db" instance 
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

    var sql = "select * from workouts where id = ?" //search by ID
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
                  "name": "cardio",
                  "creator": 1
               }'
  
    */
    console.log("Creating a new workout...");
    var errors = []
    if (!req.body.name) {
        //if name is not given
        console.log("Error 1");
        errors.push("No name specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        creator: req.body.creator
    }
    var sql = 'INSERT INTO workouts (name, creator) VALUES (?,?)'
    var params = [data.name]
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
        name: req.body.name,
        creator: req.body.creator
    }
    var sql = "UPDATE workouts set name = COALESCE(?,name), creator = COALESCE(?,creator) WHERE id = ?"
    //updating a workout according to the ID
    var params = [data.name]
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

Methods for workout_exercises

*/

app.get("/api/workout_exercises/", (req, res, next) => {
    /*
    Returns all the workout_exercises.
    Example usage:
  $ curl http://localhost:8000/api/workout_exercises -X GET 
   */
    console.log("Workout_id is set to: ");
    console.log(req.query.workout_id);
    var search = parseInt(req.query.workout_id);
    if(search==undefined){
        ////if no search terms defined
        var sql = "select * from workout_exercises";
    }
    else{
        var sql = `select workout_exercises.id, exercise.name, workout_exercises.num_sets, workout_exercises.num_reps, workout_exercises.num_seconds from workout_exercises inner join exercise on workout_exercises.exercise_id=exercise.id where workout_id=${search}`
        //if search term is defined
        
    }
    console.log("Returning workout_exercises...");
    var params = []
    db.all(sql, params, (err, rows) => {//excute the query with specified parameters
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
    db.get(sql, params, (err, row) => {//demonstrates how to query a workoutexercise by its id
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
        num_sets: req.body.num_sets,
        num_reps: req.body.num_reps,
        num_seconds: req.body.num_seconds,
        comment: req.body.comment
    }
    var sql = 'INSERT INTO workout_exercises (workout_id, exercise_id, num_sets, num_reps, num_seconds, comment) VALUES (?,?,?,?,?,?)'
    var params = [data.workout_id, data.exercise_id, data.num_sets, data.num_reps, data.num_seconds, data.comment]
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
        num_sets: req.body.num_sets,
        num_reps: req.body.num_reps,
        num_seconds: req.body.num_seconds,
        comment: req.body.comment
    }
    var sql = "UPDATE workout_exercises set workout_id = COALESCE(?,workout_id), exercise_id = COALESCE(?,exercise_id), num_sets = COALESCE(?,num_sets), num_reps = COALESCE(?,num_reps), num_seconds = COALESCE(?,num_seconds), comment = COALESCE(?,comment) WHERE id = ?"
    var params = [data.workout_id, data.exercise_id, data.num_sets, data.num_reps, data.num_seconds, data.comment, req.params.id]
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
}
